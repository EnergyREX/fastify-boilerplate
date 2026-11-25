import { Result } from "../../../domain/shared/types/Result.ts";
import { UserFactory } from "../../../domain/users/factories/User.factory.ts";
import { IUserRepository } from "../../../domain/users/repositories/IUserRepository.ts";
import { IPasswordHasher } from '../../ports/IPasswordHasher.ts'
import { IMailService } from '../../ports/IMailService.ts'
import crypto from 'crypto'
import { RegisterError } from "../errors/register.error.ts";

export async function register(
    name: string, email: string, password: string, repository: IUserRepository,
    hasher: IPasswordHasher, mailService: IMailService):
    Promise<Result<void, RegisterError>> {

    const existEmail = await repository.getByEmail(email)
    
    if (existEmail.ok) {
        return { ok: false, error: { message: "Email already exists!", code: "ERR_USER_ALREADY_EXISTS" } }
    }
    
    try {
        const factory = new UserFactory()
        const uuid = crypto.randomUUID().toString()
        const hashedPassword = await hasher.hash(password)
        const user = await factory.create(uuid, name, email, hashedPassword, false)
        const verificationCode = await hasher.generateVerificationCode()

        const saveResult = await repository.save(user, verificationCode)

        if (!saveResult.ok) {
            return { ok: false, error: {
                message: saveResult.error.message,
                code: "ERR_USER_REGISTER_FAILED"
            }}
        }

        const mailResult = await mailService.sendMail(
            'no-reply', user.getEmail(), 'Your verification code', `Your verification code is ${verificationCode}`)

        if (!mailResult.ok) {
            // Without the code the account can never be verified, so remove it to allow a retry.
            const deleteResult = await repository.delete(user.getUUID())
            if (!deleteResult.ok) console.error(`[REGISTER] Could not delete unverifiable user ${user.getUUID()}`)

            // The provider's message stays in the logs, it isn't meant for the client.
            return { ok: false, error: { message: "Could not send the verification email!", code: "ERR_USER_REGISTER_MAIL" } }
        }

        return { ok: true, value: undefined }
    } catch (err) {
        if (err instanceof Error) {
            return { ok: false, error: { message: err.message, code: "ERR_USER_REGISTER"}}
        } else {
            return { ok: false, error: { message: "Unknown error", code: "ERR_USER_REGISTER" }}
        }
    }
}