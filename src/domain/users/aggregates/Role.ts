import { UUID } from "../../shared/value-objects/UUID.ts"
import { Permission } from "../value-objects/Permission.ts"

export class Role {
    constructor(
        private uuid: UUID,
        private name: string,
        private description: string,
        private permissions: Permission[]
    ) { }

    static create(uuid: string, name: string, description: string, permissions: Permission[]) {
        return new Role(new UUID(uuid), name, description, permissions)
    }

    getUUID(): string { return this.uuid.toPrimitive() }
    getName(): string { return this.name }
    getDescription(): string { return this.description }
    getPermissions(): Permission[] { return this.permissions }
    rename(name: string) { this.name = name }

    toJSON() {
        return {
            uuid: this.uuid.toPrimitive(),
            name: this.name,
            description: this.description,
            permissions: this.permissions.map(p => ({ id: p.getUUID(), name: p.getName() }))
        }
    }
}
