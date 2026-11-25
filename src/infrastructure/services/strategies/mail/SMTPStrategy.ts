import nodemailer from 'nodemailer'
import { requireEnv } from './requireEnv.ts'
import { MailTransporterStrategy } from './MailTransporterStrategy.ts'

export class SMTPStrategy implements MailTransporterStrategy {
    createTransporter(): nodemailer.Transporter {
        const port = Number(requireEnv('SMTP_PORT'))
        const user = process.env.SMTP_USER

        return nodemailer.createTransport({
            host: requireEnv('SMTP_HOST'),
            port,
            secure: port === 465,
            // Local test servers usually don't ask for authentication.
            auth: user ? { user, pass: requireEnv('SMTP_PASS') } : undefined,
            connectionTimeout: 10_000,
            socketTimeout: 10_000
        })
    }
}
