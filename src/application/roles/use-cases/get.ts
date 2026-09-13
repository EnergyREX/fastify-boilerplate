import { Result } from "../../../domain/shared/types/Result.ts";
import { IRoleRepository } from "../../../domain/users/repositories/IRoleRepository.ts";
import { Role } from "../../../domain/users/aggregates/Role.ts";
import { GetRoleError } from "../errors/getRole.error.ts";

export async function get(uuid: string, repository: IRoleRepository): Promise<Result<Role, GetRoleError>> {
    const result = await repository.getByUUID(uuid)
    if (!result.ok) {
        return { ok: false, error: { message: result.error.message, code: "ERR_ROLE_GET" } }
    }
    return { ok: true, value: result.value }
}
