import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import nodemailer from 'nodemailer'
import { requireEnv } from './requireEnv.ts'
import { MailTransporterStrategy } from './MailTransporterStrategy.ts'

// SES through the AWS SDK. To use the SES SMTP interface, use the 'smtp' provider instead.
export class SESStrategy implements MailTransporterStrategy {
    createTransporter(): nodemailer.Transporter {
        const sesClient = new SESv2Client({
            region: requireEnv('AWS_REGION'),
            credentials: {
                accessKeyId: requireEnv('AWS_ACCESS_KEY_ID'),
                secretAccessKey: requireEnv('AWS_SECRET_ACCESS_KEY')
            }
        })

        return nodemailer.createTransport({ SES: { sesClient, SendEmailCommand } })
    }
}
