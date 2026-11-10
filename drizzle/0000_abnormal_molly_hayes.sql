CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"actor_id" uuid,
	"action" varchar(100) NOT NULL,
	"resource_type" varchar(100) NOT NULL,
	"resource_id" varchar(255) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"quote_id" uuid,
	"invoice_number" varchar(64) NOT NULL,
	"stripe_payment_intent_id" varchar(255),
	"amount_due_minor" integer NOT NULL,
	"amount_paid_minor" integer DEFAULT 0 NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"status" varchar(50) DEFAULT 'unpaid' NOT NULL,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "invoices_status_check" CHECK ("invoices"."status" IN ('unpaid', 'paid', 'void', 'refunded')),
	CONSTRAINT "invoices_amount_due_check" CHECK ("invoices"."amount_due_minor" >= 0),
	CONSTRAINT "invoices_amount_paid_check" CHECK ("invoices"."amount_paid_minor" >= 0)
);
--> statement-breakpoint
CREATE TABLE "licenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"quote_id" uuid,
	"license_key" varchar(255) NOT NULL,
	"tier" varchar(50) NOT NULL,
	"status" varchar(50) DEFAULT 'provisioning' NOT NULL,
	"valid_from" timestamp with time zone NOT NULL,
	"valid_until" timestamp with time zone NOT NULL,
	"entitlements" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "licenses_tier_check" CHECK ("licenses"."tier" IN ('starter', 'enterprise_standard', 'vector_sovereign')),
	CONSTRAINT "licenses_status_check" CHECK ("licenses"."status" IN ('provisioning', 'active', 'suspended', 'expired', 'revoked'))
);
--> statement-breakpoint
CREATE TABLE "organization_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" varchar(50) DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "org_members_role_check" CHECK ("organization_members"."role" IN ('org_admin', 'evaluator', 'billing', 'member'))
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"domain" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "org_status_check" CHECK ("organizations"."status" IN ('active', 'suspended', 'provisioning'))
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"quote_number" varchar(64) NOT NULL,
	"tier" varchar(50) NOT NULL,
	"seats" integer DEFAULT 1 NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"subtotal_minor" integer NOT NULL,
	"discount_minor" integer DEFAULT 0 NOT NULL,
	"tax_minor" integer DEFAULT 0 NOT NULL,
	"total_minor" integer NOT NULL,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "quotes_tier_check" CHECK ("quotes"."tier" IN ('starter', 'enterprise_standard', 'vector_sovereign')),
	CONSTRAINT "quotes_status_check" CHECK ("quotes"."status" IN ('draft', 'pending_approval', 'accepted', 'expired', 'rejected')),
	CONSTRAINT "quotes_seats_check" CHECK ("quotes"."seats" > 0),
	CONSTRAINT "quotes_subtotal_check" CHECK ("quotes"."subtotal_minor" >= 0),
	CONSTRAINT "quotes_discount_check" CHECK ("quotes"."discount_minor" >= 0),
	CONSTRAINT "quotes_tax_check" CHECK ("quotes"."tax_minor" >= 0),
	CONSTRAINT "quotes_total_check" CHECK ("quotes"."total_minor" >= 0)
);
--> statement-breakpoint
CREATE TABLE "storage_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"uploaded_by" uuid,
	"file_name" varchar(255) NOT NULL,
	"storage_path" varchar(1024) NOT NULL,
	"file_size_bytes" integer NOT NULL,
	"mime_type" varchar(127) NOT NULL,
	"category" varchar(50) DEFAULT 'general' NOT NULL,
	"is_private" boolean DEFAULT true NOT NULL,
	"checksum_sha256" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "storage_category_check" CHECK ("storage_files"."category" IN ('contract', 'invoice', 'blueprint', 'compliance', 'general')),
	CONSTRAINT "storage_size_check" CHECK ("storage_files"."file_size_bytes" > 0 AND "storage_files"."file_size_bytes" <= 52428800)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"environment_type" varchar(50) DEFAULT 'sandbox' NOT NULL,
	"api_key_prefix" varchar(32) NOT NULL,
	"api_key_hash" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "workspaces_env_type_check" CHECK ("workspaces"."environment_type" IN ('production', 'staging', 'sandbox'))
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_files" ADD CONSTRAINT "storage_files_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_files" ADD CONSTRAINT "storage_files_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_org_id_idx" ON "audit_logs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_logs_resource_idx" ON "audit_logs" USING btree ("resource_type","resource_id");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_deleted_at_idx" ON "audit_logs" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "invoices_number_idx" ON "invoices" USING btree ("invoice_number");--> statement-breakpoint
CREATE INDEX "invoices_org_id_idx" ON "invoices" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "invoices_quote_id_idx" ON "invoices" USING btree ("quote_id");--> statement-breakpoint
CREATE INDEX "invoices_status_idx" ON "invoices" USING btree ("status");--> statement-breakpoint
CREATE INDEX "invoices_payment_intent_idx" ON "invoices" USING btree ("stripe_payment_intent_id");--> statement-breakpoint
CREATE INDEX "invoices_created_at_idx" ON "invoices" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "invoices_deleted_at_idx" ON "invoices" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "licenses_key_idx" ON "licenses" USING btree ("license_key");--> statement-breakpoint
CREATE INDEX "licenses_org_id_idx" ON "licenses" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "licenses_quote_id_idx" ON "licenses" USING btree ("quote_id");--> statement-breakpoint
CREATE INDEX "licenses_status_idx" ON "licenses" USING btree ("status");--> statement-breakpoint
CREATE INDEX "licenses_valid_until_idx" ON "licenses" USING btree ("valid_until");--> statement-breakpoint
CREATE INDEX "licenses_created_at_idx" ON "licenses" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "licenses_deleted_at_idx" ON "licenses" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "org_user_unique_idx" ON "organization_members" USING btree ("organization_id","user_id");--> statement-breakpoint
CREATE INDEX "org_members_org_id_idx" ON "organization_members" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "org_members_user_id_idx" ON "organization_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "org_members_role_idx" ON "organization_members" USING btree ("role");--> statement-breakpoint
CREATE INDEX "org_members_deleted_at_idx" ON "organization_members" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "org_slug_idx" ON "organizations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "org_status_idx" ON "organizations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "org_created_at_idx" ON "organizations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "org_deleted_at_idx" ON "organizations" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "quotes_quote_number_idx" ON "quotes" USING btree ("quote_number");--> statement-breakpoint
CREATE INDEX "quotes_org_id_idx" ON "quotes" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "quotes_status_idx" ON "quotes" USING btree ("status");--> statement-breakpoint
CREATE INDEX "quotes_tier_idx" ON "quotes" USING btree ("tier");--> statement-breakpoint
CREATE INDEX "quotes_expires_at_idx" ON "quotes" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "quotes_created_at_idx" ON "quotes" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "quotes_deleted_at_idx" ON "quotes" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "storage_path_idx" ON "storage_files" USING btree ("storage_path");--> statement-breakpoint
CREATE INDEX "storage_files_org_id_idx" ON "storage_files" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "storage_files_uploaded_by_idx" ON "storage_files" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX "storage_files_category_idx" ON "storage_files" USING btree ("category");--> statement-breakpoint
CREATE INDEX "storage_files_created_at_idx" ON "storage_files" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "storage_files_deleted_at_idx" ON "storage_files" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_deleted_at_idx" ON "users" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "org_workspace_slug_idx" ON "workspaces" USING btree ("organization_id","slug");--> statement-breakpoint
CREATE INDEX "workspaces_org_id_idx" ON "workspaces" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "workspaces_env_type_idx" ON "workspaces" USING btree ("environment_type");--> statement-breakpoint
CREATE INDEX "workspaces_api_prefix_idx" ON "workspaces" USING btree ("api_key_prefix");--> statement-breakpoint
CREATE INDEX "workspaces_created_at_idx" ON "workspaces" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "workspaces_deleted_at_idx" ON "workspaces" USING btree ("deleted_at");