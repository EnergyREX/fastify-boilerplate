import { GenericError } from "../../domain/shared/errors/GenericError.ts"
import { Result } from "../../domain/shared/types/Result.ts"

export interface IMailService {
    verify(): Promise<Result<void, GenericError>>
    sendMail(fromName: string, sendTo: string, subject: string, text?: string, html?: string): Promise<Result<void, GenericError>>
}
