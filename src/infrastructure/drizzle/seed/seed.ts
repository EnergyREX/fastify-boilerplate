import db from '../../../config/database.ts'
import { permissions } from '../schema/permissions.ts'
import { roles } from '../schema/roles.ts'
import { rolesPermissions } from '../schema/roles_permissions.ts'
import { rolesUsers } from '../schema/users_roles.ts'
import { users } from '../schema/users.ts'
import { randomUUID } from "crypto"
import bcrypt from 'bcrypt'
import { Password } from '../../../domain/users/value-objects/Password.ts'

async function seed() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD
  if (!adminPassword) throw new Error('[SEEDER] Define SEED_ADMIN_PASSWORD')
  new Password(adminPassword) // throws if it doesn't meet the password policy

  const adminUuid = randomUUID()
  const userRoleUuid = randomUUID()
  const adminRoleUuid = randomUUID()

  await db.insert(users).values([
    {
      uuid: adminUuid,
      name: "admin",
      email: "admin@admin.com",
      password: await bcrypt.hash(adminPassword, 12),
      verificationCode: "",
      verified: true
    },
  ])

  await db.insert(roles).values([
    { uuid: userRoleUuid, name: "user", description: "Default role for a registered user" },
    { uuid: adminRoleUuid, name: "admin", description: "Full access to the platform" }
  ])

  const insertedPermissions = await db.insert(permissions).values([
    { name: "roles:read" },
    { name: "roles:create" },
    { name: "roles:update" },
    { name: "roles:delete" },
  ]).returning({ id: permissions.id })

  await db.insert(rolesPermissions).values(
    insertedPermissions.map((p) => ({ role_uuid: adminRoleUuid, permission_id: p.id }))
  )

  await db.insert(rolesUsers).values([
    { user_uuid: adminUuid, role_uuid: adminRoleUuid }
  ])

  console.info("[SEEDER] Seeded successfully")
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
