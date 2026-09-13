import { create } from "../../application/roles/use-cases/create.ts"
import { update } from "../../application/roles/use-cases/update.ts"
import { deleteRole } from "../../application/roles/use-cases/delete.ts"
import { get } from "../../application/roles/use-cases/get.ts"
import { getAll } from "../../application/roles/use-cases/getAll.ts"
import { RoleRepositoryImpl } from "../../infrastructure/repositories/RoleRepositoryImpl.ts"
import { RoleCacheImpl } from "../../infrastructure/cache/RoleCacheImpl.ts"

const roleRepository = new RoleRepositoryImpl()
const roleCache = new RoleCacheImpl()

export const rolesContainer = {
    create: (params: { name: string, description: string, permissions: number[] }) =>
        create(params.name, params.description, params.permissions, roleRepository),
    update: (params: { uuid: string, name: string, description: string, permissions: number[] }) =>
        update(params.uuid, params.name, params.description, params.permissions, roleRepository, roleCache),
    delete: (params: { uuid: string }) =>
        deleteRole(params.uuid, roleRepository, roleCache),
    get: (params: { uuid: string }) =>
        get(params.uuid, roleRepository),
    getAll: () =>
        getAll(roleRepository)
}
