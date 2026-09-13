import { Result } from "../../../domain/shared/types/Result.ts";
import { IRoleRepository } from "../../../domain/users/repositories/IRoleRepository.ts";
import { RoleCachePort } from "../../../domain/users/port/RoleCachePort.ts";
import { Role } from "../../../domain/users/aggregates/Role.ts";
import { UpdateRoleError } from "../errors/updateRole.error.ts";

export async function update(
    uuid: string,
    name: string,
    description: string,
    permissionIds: number[],
    repository: IRoleRepository,
    cache: RoleCachePort
): Promise<Result<void, UpdateRoleError>> {

    const permsResult = await repository.getPermissionsByIds(permissionIds)
    if (!permsResult.ok) {
        return { ok: false, error: { message: permsResult.error.message, code: "ERR_ROLE_UPDATE" } }
    }

    const role = Role.create(uuid, name, description, permsResult.value)

    const updateResult = await repository.update(role)
    if (!updateResult.ok) {
        return { ok: false, error: { message: updateResult.error.message, code: "ERR_ROLE_UPDATE" } }
    }

    await cache.delRole(uuid)

    return { ok: true, value: undefined }
}
