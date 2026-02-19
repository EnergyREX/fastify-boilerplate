import { boolean, date, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.ts";

export const habits = pgTable('habits', {
    uuid: uuid('uuid').notNull().primaryKey(),
    userUuid: uuid('user_uuid').notNull().references(() => users.uuid),
    name: varchar('name').notNull(),
    description: text('description').notNull(),
    repeatEvery: varchar('repeat_every').notNull(), //* Just reserialize the array, use JSON. 
    createdAt: date('created_at').defaultNow(),
    status: boolean('status').notNull().default(true),
    activeFrom: date('active_from').defaultNow(),
    inactiveFrom: date('inactive_from')
});
