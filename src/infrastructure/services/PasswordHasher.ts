import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { IPasswordHasher } from '../../application/ports/IPasswordHasher.ts'

export class PasswordHasher implements IPasswordHasher {
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, 12)
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }

    async generateVerificationCode(): Promise<string> {
        return crypto.randomBytes(32).toString('base64url')
    }
}
