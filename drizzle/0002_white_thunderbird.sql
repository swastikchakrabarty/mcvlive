CREATE TABLE "background_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_type" varchar(100) NOT NULL,
	"organization_id" uuid,
	"idempotency_key" varchar(255) NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 3 NOT NULL,
	"last_error" text,
	"scheduled_for" timestamp with time zone DEFAULT now() NOT NULL,
	"locked_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bg_jobs_status_check" CHECK ("background_jobs"."status" IN ('pending', 'running', 'completed', 'failed'))
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" varchar(255) NOT NULL,
	"provider" varchar(50) DEFAULT 'stripe' NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"organization_id" uuid,
	"status" varchar(50) DEFAULT 'processing' NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"error_message" text,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "webhook_status_check" CHECK ("webhook_events"."status" IN ('processing', 'processed', 'failed'))
);
--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "subscription_tier" varchar(50) DEFAULT 'starter' NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "subscription_status" varchar(50) DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "stripe_customer_id" varchar(255);--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "stripe_subscription_id" varchar(255);--> statement-breakpoint
ALTER TABLE "background_jobs" ADD CONSTRAINT "background_jobs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD CONSTRAINT "webhook_events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "bg_jobs_idempotency_key_idx" ON "background_jobs" USING btree ("idempotency_key");--> statement-breakpoint
CREATE INDEX "bg_jobs_org_id_idx" ON "background_jobs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "bg_jobs_type_status_idx" ON "background_jobs" USING btree ("job_type","status");--> statement-breakpoint
CREATE INDEX "bg_jobs_scheduled_idx" ON "background_jobs" USING btree ("scheduled_for");--> statement-breakpoint
CREATE UNIQUE INDEX "webhook_event_id_idx" ON "webhook_events" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "webhook_org_id_idx" ON "webhook_events" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "webhook_type_idx" ON "webhook_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "webhook_created_at_idx" ON "webhook_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "org_tier_idx" ON "organizations" USING btree ("subscription_tier");--> statement-breakpoint
CREATE INDEX "org_stripe_cust_idx" ON "organizations" USING btree ("stripe_customer_id");--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "org_sub_tier_check" CHECK ("organizations"."subscription_tier" IN ('starter', 'enterprise_standard', 'vector_sovereign'));--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "org_sub_status_check" CHECK ("organizations"."subscription_status" IN ('trialing', 'active', 'past_due', 'canceled', 'unpaid'));