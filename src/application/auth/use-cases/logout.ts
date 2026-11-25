import { IUserRepository } from "../../../domain/users/repositories/IUserRepository.ts"
import { Result } from "../../../domain/shared/types/Result.ts"
import { LogoutError } from "../errors/logout.error.ts"
import { RefreshToken } from "../types/RefreshToken.js"
import { ITokenService } from "../../ports/ITokenService.ts"

export async function logout
(cookie: string, tokenService: ITokenService, userRepository: IUserRepository): Promise<Result<void, LogoutError>> {

  // Check if the token is legit, and that it is a refresh one
  const verified = await tokenService.verify<RefreshToken>(cookie)

  if (!verified.ok || verified.value.type !== 'refresh') {
    return {
      ok: false,
      error: { message: "This cookie is not valid!", code: "ERR_USER_LOGOUT_COOKIE_NOT_VALID" }
    }
  }

  // If legit, invalidate in database.
  const result = await userRepository.invalidateRefresh(cookie, verified.value.iat, verified.value.exp)

  if (result.ok) {
    return { ok: true, value: undefined }
  } else {
    return { ok: false, error: { message: result.error.message, code: "ERR_USER_LOGOUT_INFRASTRUCTURE" } }
  }
}
