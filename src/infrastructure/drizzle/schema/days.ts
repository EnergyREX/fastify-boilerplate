import { date, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.ts";

export const days = pgTable('days', {
    uuid: uuid('uuid').notNull().primaryKey(),
    ownerUuid: uuid('owner_uuid').references(() => users.uuid),
    realDay: date('realDay').defaultNow(),
    dailyThought: text('daily_thought').notNull()
})