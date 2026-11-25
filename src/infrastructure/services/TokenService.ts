import { randomUUID } from 'node:crypto'
import jwt from 'jsonwebtoken'
import { ITokenService } from '../../application/ports/ITokenService.ts'
import { GenericError } from '../../domain/shared/errors/GenericError.ts'
import { Result } from '../../domain/shared/types/Result.ts'

export class TokenService implements ITokenService {

    // Read on use, so it doesn't depend on dotenv being loaded before this module.
    private getSecret(): string {
        const secret = process.env.JWT_SECRET_KEY
        if (!secret) throw new Error('JWT_SECRET_KEY is not defined!')
        return secret
    }

    async sign(payload: object, options: { expiresIn: number }): Promise<string> {
        // The unique jwtid keeps two tokens signed within the same second from being identical,
        // otherwise a rotated refresh token could match the one that was just revoked.
        return jwt.sign(payload, this.getSecret(), { algorithm: 'HS256', jwtid: randomUUID(), ...options })
    }

    async verify<T>(token: string): Promise<Result<T, GenericError>> {
        try {
            return { ok: true, value: jwt.verify(token, this.getSecret(), { algorithms: ['HS256'] }) as T }
        } catch {
            return { ok: false, error: { message: 'Token is not valid!', code: 'ERR_TOKEN_VERIFICATION' } }
        }
    }
}
