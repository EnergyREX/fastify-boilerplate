import { boolean, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.ts";
import { habits } from "./habits.ts";
import { days } from "./days.ts";

export const habitInstances = pgTable('habit_instances', {
    userUuid: uuid('user_uuid').references(() => users.uuid),
    habitUuid: uuid('habit_uuid').references(() => habits.uuid),
    day: uuid('day').references(() => days.uuid),
    name: varchar('name').notNull(),
    description: text('description').notNull(),
    completed: boolean().default(false)
})