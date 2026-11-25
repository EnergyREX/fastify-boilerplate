import { ITokenService } from "../../ports/ITokenService.ts";
import { Result } from "../../../domain/shared/types/Result.ts";
import { RefreshError } from "../errors/refresh.error.ts";
import type { RefreshResult } from "../types/RefreshResult.d.ts"
import { RefreshToken } from "../types/RefreshToken.js";
import { IUserRepository } from "../../../domain/users/repositories/IUserRepository.ts";
import { IRoleRepository } from "../../../domain/users/repositories/IRoleRepository.ts";

export async function refresh(
    cookie: string,
    tokenService: ITokenService,
    repository: IUserRepository,
    roleRepository: IRoleRepository
): Promise<Result<RefreshResult, RefreshError>> {
    const verified = await tokenService.verify<RefreshToken>(cookie);
    if (!verified.ok) {
        return { ok: false, error: { message: "Cookie is not valid!", code: "ERR_AUTH_REFRESH_TOKEN" } };
    }

    const result = verified.value
    if (result.type !== 'refresh') {
        return { ok: false, error: { message: "This is not a refresh token!", code: "ERR_AUTH_REFRESH_NOT_A_REFRESH" } };
    }

    const isRevoked = await repository.checkRevoked(cookie)
    if (isRevoked) {
        return { ok: false, error: { message: "This token was revoked!", code: "ERR_AUTH_REFRESH_INVALIDATED" } };
    }

    // A unique constraint on revoked_tokens.token makes this the atomicity guard: if two
    // requests race on the same refresh token, only one insert wins and the loser is rejected.
    const invalidated = await repository.invalidateRefresh(cookie, result.iat, result.exp);
    if (!invalidated.ok) {
        return { ok: false, error: { message: "This token was already used!", code: "ERR_AUTH_REFRESH_INVALIDATE" } };
    }

    const dbUserRoles = await roleRepository.getByUserUUID(result.uuid)
    const rolesUuids = dbUserRoles.ok ? dbUserRoles.value.map((r) => r.getUUID()) : []

    const refreshToken = await tokenService.sign({
        uuid: result.uuid,
        email: result.email,
        type: 'refresh'
    }, { expiresIn: 7 * 24 * 60 * 60 });

    const accessToken = await tokenService.sign({
        uuid: result.uuid,
        roles: rolesUuids,
        type: 'access'
    }, { expiresIn: 30 * 60 });

    return { ok: true, value: { refreshToken, accessToken } };
}