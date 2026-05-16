import { GenericError } from "../../shared/errors/GenericError.ts";
import { Result } from "../../shared/types/Result.ts";
import { Permission } from "../value-objects/Permission.ts";

export interface RoleCachePort {
    getPermissions(roleUuid: string): Promise<Result<Permission[], GenericError>>
    setPermissions(roleUuid: string, permissions: Permission[], ttlSeconds: number): Promise<Result<void, GenericError>>
    delRole(roleUuid: string): Promise<Result<void, GenericError>>
}