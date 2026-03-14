import { UUID } from "../../shared/value-objects/UUID.ts"
import { Password } from "../value-objects/Password.ts"
import { Email } from "../value-objects/Email.ts"

export class User {
  private readonly uuid: UUID
  private readonly name: string
  private readonly email: Email
  private readonly password: Password
  private verified: boolean
  private roleId: number

  constructor(uuid: UUID, name: string, email: Email, password: Password, verified: boolean, roleId: number) {
      this.uuid = uuid
      this.name = name
      this.email = email
      this.password = password
      this.verified = verified
      this.roleId = roleId
  }

  getUser() { return this }
  getUUID(): string { return this.uuid.toPrimitive() }
  getName(): string { return this.name }
  getEmail(): string { return this.email.getValue() }
  getPassword(): string { return this.password.getValue() }
  isVerified(): boolean { return this.verified }
  getRoleId(): number { return this.roleId }

  verify(): boolean {
    if (this.verified == true) {
      throw new Error('This user is already verified!')
    }
    this.verified = true
    return true
  }

  changeRole(roleId: number): boolean {
    this.roleId = roleId
    return true
  }

  toJson() {
    return {
        uuid: this.uuid.toString(),
        username: this.name,
        email: this.email.getValue(),
    }
  }
}
