import { GenericError } from "../../shared/errors/GenericError.ts";
import { Result } from "../../shared/types/Result.ts";
import { Role } from "../aggregates/Role.ts";
import { Permission } from "../value-objects/Permission.ts";

export interface IRoleRepository {
    save(value: Role): Promise<Result<string, GenericError>>

    getAll(): Promise<Result<Role[], GenericError>>
    getByUUID(uuid: string): Promise<Result<Role, GenericError>>
    getByUserUUID(userUuid: string): Promise<Result<Role[], GenericError>>
    getPermissionsByIds(ids: number[]): Promise<Result<Permission[], GenericError>>

    update(value: Role): Promise<Result<void, GenericError>>
    delete(uuid: string): Promise<Result<void, GenericError>>
}