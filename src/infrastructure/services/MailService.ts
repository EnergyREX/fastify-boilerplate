import nodemailer from 'nodemailer'
import { IMailService } from '../../application/ports/IMailService.ts'
import { GenericError } from '../../domain/shared/errors/GenericError.ts'
import { Result } from '../../domain/shared/types/Result.ts'
import { MailTransporterStrategy } from './strategies/mail/MailTransporterStrategy.ts'
import { SESStrategy } from './strategies/mail/SESStrategy.ts'
import { SMTPStrategy } from './strategies/mail/SMTPStrategy.ts'
import { requireEnv } from './strategies/mail/requireEnv.ts'

const strategies: Record<string, () => MailTransporterStrategy> = {
    ses: () => new SESStrategy(),
    smtp: () => new SMTPStrategy()
}

export class MailService implements IMailService {
    private transporter?: nodemailer.Transporter

    // Created on first use, so the server can start without mail settings.
    private getTransporter(): nodemailer.Transporter {
        if (this.transporter) return this.transporter

        const provider = requireEnv('MAIL_PROVIDER')
        if (!Object.hasOwn(strategies, provider)) {
            throw new Error(`Unknown MAIL_PROVIDER "${provider}". Use "smtp" or "ses".`)
        }

        this.transporter = strategies[provider]().createTransporter()
        return this.transporter
    }

    async verify(): Promise<Result<void, GenericError>> {
        try {
            await this.getTransporter().verify()
            return { ok: true, value: undefined }
        } catch (err) {
            return this.toFailure(err, 'ERR_MAIL_VERIFY')
        }
    }

    async sendMail(fromName: string, sendTo: string, subject: string, text?: string, html?: string): Promise<Result<void, GenericError>> {
        try {
            await this.getTransporter().sendMail({
                from: { name: fromName, address: requireEnv('MAIL_SENDER') },
                to: sendTo,
                subject,
                text,
                html
            })
            return { ok: true, value: undefined }
        } catch (err) {
            return this.toFailure(err, 'ERR_MAIL_SEND')
        }
    }

    private toFailure(err: unknown, code: string): { ok: false, error: GenericError } {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.error(`[MAIL] ${code}: ${message}`)
        return { ok: false, error: { message, code } }
    }
}
