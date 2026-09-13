import { Result } from "../../../domain/shared/types/Result.ts";
import { IRoleRepository } from "../../../domain/users/repositories/IRoleRepository.ts";
import { RoleCachePort } from "../../../domain/users/port/RoleCachePort.ts";
import { DeleteRoleError } from "../errors/deleteRole.error.ts";

export async function deleteRole(
    uuid: string,
    repository: IRoleRepository,
    cache: RoleCachePort
): Promise<Result<void, DeleteRoleError>> {

    const result = await repository.delete(uuid)
    if (!result.ok) {
        return { ok: false, error: { message: result.error.message, code: "ERR_ROLE_DELETE" } }
    }

    await cache.delRole(uuid)

    return { ok: true, value: undefined }
}
