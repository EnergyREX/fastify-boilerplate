import { GenericError } from "../../domain/shared/errors/GenericError.ts"
import { Result } from "../../domain/shared/types/Result.ts"

export interface ITokenService {
    sign(payload: object, options: { expiresIn: number }): Promise<string>
    verify<T>(token: string): Promise<Result<T, GenericError>>
}
