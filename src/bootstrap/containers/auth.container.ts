import { login } from "../../application/auth/use-cases/login.ts"
import { register } from "../../application/auth/use-cases/register.ts"
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl.ts"
import { RoleRepositoryImpl } from "../../infrastructure/repositories/RoleRepositoryImpl.ts"
import { TokenService } from "../../infrastructure/services/TokenService.ts"
import { PasswordHasher } from "../../infrastructure/services/PasswordHasher.ts"
import { MailService } from "../../infrastructure/services/MailService.ts"
import { refresh } from "../../application/auth/use-cases/refresh.ts"
import { logout } from "../../application/auth/use-cases/logout.ts"
import { verify } from "../../application/auth/use-cases/verify.ts"

const userRepository = new UserRepositoryImpl()
const roleRepository = new RoleRepositoryImpl()
const tokenService = new TokenService()
const hasher = new PasswordHasher()
const mailService = new MailService()

export const authContainer = {
    register: (params: { name: string, email: string, password: string }) => register(params.name, params.email, params.password, userRepository, hasher, mailService),
    login: (params: { email: string, password: string }) => login(params.email, params.password, tokenService, userRepository, roleRepository, hasher),
    refresh: (params: { cookie: string }) => refresh(params.cookie, tokenService, userRepository, roleRepository),
    logout: (params: { cookie: string }) => logout(params.cookie, tokenService, userRepository),
    verify: (params: { code: string }) => verify(params.code, userRepository)
}
