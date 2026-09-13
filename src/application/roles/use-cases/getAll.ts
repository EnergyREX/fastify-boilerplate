import { Result } from "../../../domain/shared/types/Result.ts";
import { IRoleRepository } from "../../../domain/users/repositories/IRoleRepository.ts";
import { Role } from "../../../domain/users/aggregates/Role.ts";
import { GetRolesError } from "../errors/getRoles.error.ts";

export async function getAll(repository: IRoleRepository): Promise<Result<Role[], GetRolesError>> {
    const result = await repository.getAll()
    if (!result.ok) {
        return { ok: false, error: { message: result.error.message, code: "ERR_ROLES_GET_ALL" } }
    }
    return { ok: true, value: result.value }
}
