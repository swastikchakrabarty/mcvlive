import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";

// =============================================================================
// 1. ORGANIZATIONS (Global Root Tenant Entity)
// =============================================================================
export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    status: varchar("status", { length: 50 }).notNull().default("active"),
    domain: varchar("domain", { length: 255 }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("org_slug_idx").on(table.slug),
    index("org_status_idx").on(table.status),
    index("org_created_at_idx").on(table.created_at),
    index("org_deleted_at_idx").on(table.deleted_at),
    check("org_status_check", sql`${table.status} IN ('active', 'suspended', 'provisioning')`),
  ],
);

// =============================================================================
// 2. USERS (Global Platform Identity)
// =============================================================================
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    full_name: varchar("full_name", { length: 255 }).notNull(),
    avatar_url: text("avatar_url"),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    index("users_created_at_idx").on(table.created_at),
    index("users_deleted_at_idx").on(table.deleted_at),
  ],
);

// =============================================================================
// 3. ORGANIZATION MEMBERS (Tenant-Owned RBAC Membership)
// =============================================================================
export const organizationMembers = pgTable(
  "organization_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organization_id: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 50 }).notNull().default("member"),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("org_user_unique_idx").on(table.organization_id, table.user_id),
    index("org_members_org_id_idx").on(table.organization_id),
    index("org_members_user_id_idx").on(table.user_id),
    index("org_members_role_idx").on(table.role),
    index("org_members_deleted_at_idx").on(table.deleted_at),
    check("org_members_role_check", sql`${table.role} IN ('owner', 'admin', 'member', 'viewer')`),
  ],
);

// =============================================================================
// 4. WORKSPACES (Tenant-Owned Deployment Environments)
// =============================================================================
export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organization_id: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    environment_type: varchar("environment_type", { length: 50 }).notNull().default("sandbox"),
    api_key_prefix: varchar("api_key_prefix", { length: 32 }).notNull(),
    api_key_hash: varchar("api_key_hash", { length: 255 }).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("org_workspace_slug_idx").on(table.organization_id, table.slug),
    index("workspaces_org_id_idx").on(table.organization_id),
    index("workspaces_env_type_idx").on(table.environment_type),
    index("workspaces_api_prefix_idx").on(table.api_key_prefix),
    index("workspaces_created_at_idx").on(table.created_at),
    index("workspaces_deleted_at_idx").on(table.deleted_at),
    check(
      "workspaces_env_type_check",
      sql`${table.environment_type} IN ('production', 'staging', 'sandbox')`,
    ),
  ],
);

// =============================================================================
// 5. QUOTES (Tenant-Owned Sales Quotes & Tier Customization)
// =============================================================================
export const quotes = pgTable(
  "quotes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organization_id: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    quote_number: varchar("quote_number", { length: 64 }).notNull(),
    tier: varchar("tier", { length: 50 }).notNull(),
    seats: integer("seats").notNull().default(1),
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    // Monetary values stored strictly as integer minor units (e.g. cents/paise)
    subtotal_minor: integer("subtotal_minor").notNull(),
    discount_minor: integer("discount_minor").notNull().default(0),
    tax_minor: integer("tax_minor").notNull().default(0),
    total_minor: integer("total_minor").notNull(),
    status: varchar("status", { length: 50 }).notNull().default("draft"),
    expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("quotes_quote_number_idx").on(table.quote_number),
    index("quotes_org_id_idx").on(table.organization_id),
    index("quotes_status_idx").on(table.status),
    index("quotes_tier_idx").on(table.tier),
    index("quotes_expires_at_idx").on(table.expires_at),
    index("quotes_created_at_idx").on(table.created_at),
    index("quotes_deleted_at_idx").on(table.deleted_at),
    check(
      "quotes_tier_check",
      sql`${table.tier} IN ('starter', 'enterprise_standard', 'vector_sovereign')`,
    ),
    check(
      "quotes_status_check",
      sql`${table.status} IN ('draft', 'pending_approval', 'accepted', 'expired', 'rejected')`,
    ),
    check("quotes_seats_check", sql`${table.seats} > 0`),
    check("quotes_subtotal_check", sql`${table.subtotal_minor} >= 0`),
    check("quotes_discount_check", sql`${table.discount_minor} >= 0`),
    check("quotes_tax_check", sql`${table.tax_minor} >= 0`),
    check("quotes_total_check", sql`${table.total_minor} >= 0`),
  ],
);

// =============================================================================
// 6. LICENSES (Tenant-Owned Software Licensing & Entitlements)
// =============================================================================
export const licenses = pgTable(
  "licenses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organization_id: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    quote_id: uuid("quote_id").references(() => quotes.id, { onDelete: "set null" }),
    license_key: varchar("license_key", { length: 255 }).notNull(),
    tier: varchar("tier", { length: 50 }).notNull(),
    status: varchar("status", { length: 50 }).notNull().default("provisioning"),
    valid_from: timestamp("valid_from", { withTimezone: true }).notNull(),
    valid_until: timestamp("valid_until", { withTimezone: true }).notNull(),
    entitlements: jsonb("entitlements")
      .notNull()
      .default(sql`'{}'::jsonb`),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("licenses_key_idx").on(table.license_key),
    index("licenses_org_id_idx").on(table.organization_id),
    index("licenses_quote_id_idx").on(table.quote_id),
    index("licenses_status_idx").on(table.status),
    index("licenses_valid_until_idx").on(table.valid_until),
    index("licenses_created_at_idx").on(table.created_at),
    index("licenses_deleted_at_idx").on(table.deleted_at),
    check(
      "licenses_tier_check",
      sql`${table.tier} IN ('starter', 'enterprise_standard', 'vector_sovereign')`,
    ),
    check(
      "licenses_status_check",
      sql`${table.status} IN ('provisioning', 'active', 'suspended', 'expired', 'revoked')`,
    ),
  ],
);

// =============================================================================
// 7. INVOICES (Tenant-Owned Invoicing & Transaction Records)
// =============================================================================
export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organization_id: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    quote_id: uuid("quote_id").references(() => quotes.id, { onDelete: "set null" }),
    invoice_number: varchar("invoice_number", { length: 64 }).notNull(),
    stripe_payment_intent_id: varchar("stripe_payment_intent_id", { length: 255 }),
    amount_due_minor: integer("amount_due_minor").notNull(),
    amount_paid_minor: integer("amount_paid_minor").notNull().default(0),
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    status: varchar("status", { length: 50 }).notNull().default("unpaid"),
    paid_at: timestamp("paid_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("invoices_number_idx").on(table.invoice_number),
    index("invoices_org_id_idx").on(table.organization_id),
    index("invoices_quote_id_idx").on(table.quote_id),
    index("invoices_status_idx").on(table.status),
    index("invoices_payment_intent_idx").on(table.stripe_payment_intent_id),
    index("invoices_created_at_idx").on(table.created_at),
    index("invoices_deleted_at_idx").on(table.deleted_at),
    check("invoices_status_check", sql`${table.status} IN ('unpaid', 'paid', 'void', 'refunded')`),
    check("invoices_amount_due_check", sql`${table.amount_due_minor} >= 0`),
    check("invoices_amount_paid_check", sql`${table.amount_paid_minor} >= 0`),
  ],
);

// =============================================================================
// 8. STORAGE FILES (Tenant-Owned File Metadata & Scoped Storage)
// =============================================================================
export const storageFiles = pgTable(
  "storage_files",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organization_id: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    uploaded_by: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
    file_name: varchar("file_name", { length: 255 }).notNull(),
    storage_path: varchar("storage_path", { length: 1024 }).notNull(),
    file_size_bytes: integer("file_size_bytes").notNull(),
    mime_type: varchar("mime_type", { length: 127 }).notNull(),
    category: varchar("category", { length: 50 }).notNull().default("general"),
    is_private: boolean("is_private").notNull().default(true),
    checksum_sha256: varchar("checksum_sha256", { length: 64 }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("storage_path_idx").on(table.storage_path),
    index("storage_files_org_id_idx").on(table.organization_id),
    index("storage_files_uploaded_by_idx").on(table.uploaded_by),
    index("storage_files_category_idx").on(table.category),
    index("storage_files_created_at_idx").on(table.created_at),
    index("storage_files_deleted_at_idx").on(table.deleted_at),
    check(
      "storage_category_check",
      sql`${table.category} IN ('contract', 'invoice', 'blueprint', 'compliance', 'general')`,
    ),
    check(
      "storage_size_check",
      sql`${table.file_size_bytes} > 0 AND ${table.file_size_bytes} <= 52428800`,
    ),
  ],
);

// =============================================================================
// 9. AUDIT LOGS (Tenant-Owned Immutable Audit Trail)
// =============================================================================
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organization_id: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    actor_id: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 100 }).notNull(),
    resource_type: varchar("resource_type", { length: 100 }).notNull(),
    resource_id: varchar("resource_id", { length: 255 }).notNull(),
    metadata: jsonb("metadata")
      .notNull()
      .default(sql`'{}'::jsonb`),
    ip_address: varchar("ip_address", { length: 45 }),
    user_agent: text("user_agent"),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("audit_logs_org_id_idx").on(table.organization_id),
    index("audit_logs_actor_id_idx").on(table.actor_id),
    index("audit_logs_action_idx").on(table.action),
    index("audit_logs_resource_idx").on(table.resource_type, table.resource_id),
    index("audit_logs_created_at_idx").on(table.created_at),
    index("audit_logs_deleted_at_idx").on(table.deleted_at),
  ],
);

// =============================================================================
// 10. INVITATIONS (Tenant-Owned Team Invitations)
// =============================================================================
export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organization_id: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    role: varchar("role", { length: 50 }).notNull().default("member"),
    token_hash: varchar("token_hash", { length: 255 }).notNull(),
    invited_by: uuid("invited_by").references(() => users.id, { onDelete: "set null" }),
    status: varchar("status", { length: 50 }).notNull().default("pending"),
    expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("invitations_token_hash_idx").on(table.token_hash),
    index("invitations_org_id_idx").on(table.organization_id),
    index("invitations_email_idx").on(table.email),
    index("invitations_status_idx").on(table.status),
    index("invitations_expires_at_idx").on(table.expires_at),
    index("invitations_created_at_idx").on(table.created_at),
    index("invitations_deleted_at_idx").on(table.deleted_at),
    check("invitations_role_check", sql`${table.role} IN ('owner', 'admin', 'member', 'viewer')`),
    check(
      "invitations_status_check",
      sql`${table.status} IN ('pending', 'accepted', 'revoked', 'expired')`,
    ),
  ],
);

// =============================================================================
// RELATIONS DEFINITIONS (Type-safe join navigations)
// =============================================================================
export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(organizationMembers),
  workspaces: many(workspaces),
  quotes: many(quotes),
  licenses: many(licenses),
  invoices: many(invoices),
  storageFiles: many(storageFiles),
  auditLogs: many(auditLogs),
  invitations: many(invitations),
}));

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(organizationMembers),
  uploadedFiles: many(storageFiles),
  auditLogs: many(auditLogs),
}));

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationMembers.organization_id],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [organizationMembers.user_id],
    references: [users.id],
  }),
}));

export const workspacesRelations = relations(workspaces, ({ one }) => ({
  organization: one(organizations, {
    fields: [workspaces.organization_id],
    references: [organizations.id],
  }),
}));

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [quotes.organization_id],
    references: [organizations.id],
  }),
  licenses: many(licenses),
  invoices: many(invoices),
}));

export const licensesRelations = relations(licenses, ({ one }) => ({
  organization: one(organizations, {
    fields: [licenses.organization_id],
    references: [organizations.id],
  }),
  quote: one(quotes, {
    fields: [licenses.quote_id],
    references: [quotes.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  organization: one(organizations, {
    fields: [invoices.organization_id],
    references: [organizations.id],
  }),
  quote: one(quotes, {
    fields: [invoices.quote_id],
    references: [quotes.id],
  }),
}));

export const storageFilesRelations = relations(storageFiles, ({ one }) => ({
  organization: one(organizations, {
    fields: [storageFiles.organization_id],
    references: [organizations.id],
  }),
  uploader: one(users, {
    fields: [storageFiles.uploaded_by],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  organization: one(organizations, {
    fields: [auditLogs.organization_id],
    references: [organizations.id],
  }),
  actor: one(users, {
    fields: [auditLogs.actor_id],
    references: [users.id],
  }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [invitations.organization_id],
    references: [organizations.id],
  }),
  inviter: one(users, {
    fields: [invitations.invited_by],
    references: [users.id],
  }),
}));
