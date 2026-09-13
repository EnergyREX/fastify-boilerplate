import crypto from 'crypto'
import { Result } from "../../../domain/shared/types/Result.ts";
import { IRoleRepository } from "../../../domain/users/repositories/IRoleRepository.ts";
import { Role } from "../../../domain/users/aggregates/Role.ts";
import { CreateRoleError } from "../errors/createRole.error.ts";

export async function create(
    name: string,
    description: string,
    permissionIds: number[],
    repository: IRoleRepository
): Promise<Result<string, CreateRoleError>> {

    const permsResult = await repository.getPermissionsByIds(permissionIds)
    if (!permsResult.ok) {
        return { ok: false, error: { message: permsResult.error.message, code: "ERR_ROLE_CREATION" } }
    }

    const uuid = crypto.randomUUID()
    const role = Role.create(uuid, name, description, permsResult.value)

    const saveResult = await repository.save(role)
    if (!saveResult.ok) {
        return { ok: false, error: { message: saveResult.error.message, code: "ERR_ROLE_CREATION" } }
    }

    return { ok: true, value: saveResult.value }
}
