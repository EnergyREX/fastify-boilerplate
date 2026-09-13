import { FastifyInstance } from "fastify";
import { Result } from "../../../domain/shared/types/Result.ts";
import { RefreshError } from "../errors/refresh.error.ts";
import type { RefreshResult } from "../types/RefreshResult.d.ts"
import { RefreshToken } from "../types/RefreshToken.js";
import { IUserRepository } from "../../../domain/users/repositories/IUserRepository.ts";
import { IRoleRepository } from "../../../domain/users/repositories/IRoleRepository.ts";

export async function refresh(
    cookie: string,
    fastify: FastifyInstance,
    repository: IUserRepository,
    roleRepository: IRoleRepository
): Promise<Result<RefreshResult, RefreshError>> {
    let result: RefreshToken;

    try {
        result = await fastify.jwt.verify(cookie) as RefreshToken;
    } catch (err) {
        return { ok: false, error: { message: "Cookie is not valid!", code: "ERR_AUTH_REFRESH_TOKEN" } };
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

    const refreshToken = fastify.jwt.sign({
        uuid: result.uuid,
        email: result.email
    }, { expiresIn: "7d" });

    const accessToken = fastify.jwt.sign({
        uuid: result.uuid,
        roles: rolesUuids
    }, { expiresIn: "30m" });

    return { ok: true, value: { refreshToken, accessToken } };
}