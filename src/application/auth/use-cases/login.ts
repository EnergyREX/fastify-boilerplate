import { IUserRepository } from '../../../domain/users/repositories/IUserRepository.ts'
import { IRoleRepository } from '../../../domain/users/repositories/IRoleRepository.ts'
import { ITokenService } from '../../ports/ITokenService.ts'
import { IPasswordHasher } from '../../ports/IPasswordHasher.ts'
import { Result } from '../../../domain/shared/types/Result.ts'
import { LoginError } from '../errors/login.error.ts'

// A bcrypt hash of an unreachable password, compared against when the email doesn't exist so
// the request takes the same time either way and an attacker can't enumerate emails via timing.
const DUMMY_HASH = '$2b$12$2Q5P6GJRZy/Q2Mz20P1u2.3xMHSNZfv7Hz6rKKtYfBImcQ06sj7Um'

export async function login (
  email: string, password: string,
  tokenService: ITokenService,
  repository: IUserRepository,
  roleRepository: IRoleRepository,
  hasher: IPasswordHasher): Promise<Result<LoginResult, LoginError>> {

  const result = await repository.getByEmail(email)
  const user = result.ok ? result.value : null

  const userPasswd = user ? user.getPassword() : DUMMY_HASH
  const passwordsMatch = await hasher.compare(String(password), String(userPasswd))

  if (!user || !passwordsMatch) {
    return {
      ok: false,
      error: { message: "Invalid credentials!", code: "ERR_USER_LOGIN_INVALID" }
    }
  }

  if (!(await user.isVerified())) {
    return {ok: false,
    error: { message: "This user is not verified!", code: "ERR_USER_NOT_VERIFIED" }}
  }

  const dbUserRoles = await roleRepository.getByUserUUID(user.getUUID())
  const rolesUuids = dbUserRoles.ok ? dbUserRoles.value.map((r) => r.getUUID()) : []

  // After that, generate booth tokens and return them
  const refreshToken = await tokenService.sign({
    uuid: user.getUUID(),
    email: user.getEmail(),
    type: 'refresh'
  }, { expiresIn: 7 * 24 * 60 * 60 })

  const accessToken = await tokenService.sign({
    uuid: user.getUUID(),
    roles: rolesUuids,
    type: 'access'
  }, { expiresIn: 30 * 60 })


  // Return response
  return {
    ok: true,
    value: {
      uuid: user.getUUID(),
      email: user.getEmail(),
      tokens: {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    }
  }
}
