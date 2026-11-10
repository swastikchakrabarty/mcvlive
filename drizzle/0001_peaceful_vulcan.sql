CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'member' NOT NULL,
	"token_hash" varchar(255) NOT NULL,
	"invited_by" uuid,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "invitations_role_check" CHECK ("invitations"."role" IN ('owner', 'admin', 'member', 'viewer')),
	CONSTRAINT "invitations_status_check" CHECK ("invitations"."status" IN ('pending', 'accepted', 'revoked', 'expired'))
);
--> statement-breakpoint
ALTER TABLE "organization_members" DROP CONSTRAINT "org_members_role_check";--> statement-breakpoint
UPDATE "organization_members" SET "role" = 'owner' WHERE "role" = 'org_admin';--> statement-breakpoint
UPDATE "organization_members" SET "role" = 'admin' WHERE "role" = 'evaluator';--> statement-breakpoint
UPDATE "organization_members" SET "role" = 'viewer' WHERE "role" = 'billing';--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "invitations_token_hash_idx" ON "invitations" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "invitations_org_id_idx" ON "invitations" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "invitations_email_idx" ON "invitations" USING btree ("email");--> statement-breakpoint
CREATE INDEX "invitations_status_idx" ON "invitations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "invitations_expires_at_idx" ON "invitations" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "invitations_created_at_idx" ON "invitations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "invitations_deleted_at_idx" ON "invitations" USING btree ("deleted_at");--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "org_members_role_check" CHECK ("organization_members"."role" IN ('owner', 'admin', 'member', 'viewer'));