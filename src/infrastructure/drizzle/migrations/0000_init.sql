CREATE TABLE "permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revoked_tokens" (
	"token" varchar PRIMARY KEY NOT NULL,
	"expires_at" integer NOT NULL,
	"created_at" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles_permissions" (
	"role_uuid" uuid NOT NULL,
	"permission_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar
);
--> statement-breakpoint
CREATE TABLE "roles_users" (
	"user_uuid" uuid,
	"role_uuid" uuid
);
--> statement-breakpoint
CREATE TABLE "users" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"verification_code" varchar,
	"verified" boolean DEFAULT false NOT NULL,
	"joined_at" date DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "roles_permissions" ADD CONSTRAINT "roles_permissions_role_uuid_roles_uuid_fk" FOREIGN KEY ("role_uuid") REFERENCES "public"."roles"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles_permissions" ADD CONSTRAINT "roles_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles_users" ADD CONSTRAINT "roles_users_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles_users" ADD CONSTRAINT "roles_users_role_uuid_roles_uuid_fk" FOREIGN KEY ("role_uuid") REFERENCES "public"."roles"("uuid") ON DELETE no action ON UPDATE no action;