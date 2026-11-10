import { getDb, closeDbPool } from "./index";
import {
  organizations,
  users,
  organizationMembers,
  invitations,
  workspaces,
  quotes,
  licenses,
  invoices,
  storageFiles,
  auditLogs,
  webhookEvents,
  backgroundJobs,
} from "./schema";
import crypto from "node:crypto";

export async function runSeed(customDb = getDb()) {
  console.log("Starting idempotent database seed for Morland Chambers Vector...");

  // 1. Clean existing seed records
  await customDb.delete(backgroundJobs);
  await customDb.delete(webhookEvents);
  await customDb.delete(auditLogs);
  await customDb.delete(storageFiles);
  await customDb.delete(invoices);
  await customDb.delete(licenses);
  await customDb.delete(quotes);
  await customDb.delete(workspaces);
  await customDb.delete(invitations);
  await customDb.delete(organizationMembers);
  await customDb.delete(users);
  await customDb.delete(organizations);

  // ---------------------------------------------------------------------------
  // ORGANIZATION 1: Apex Sovereign Systems Ltd
  // ---------------------------------------------------------------------------
  const [org1] = await customDb
    .insert(organizations)
    .values({
      name: "Apex Sovereign Systems Ltd",
      slug: "apex-sovereign",
      status: "active",
      domain: "apexsovereign.io",
    })
    .returning();

  if (!org1) throw new Error("Failed to seed Organization 1");

  const [user1_1, user1_2, user1_3] = await customDb
    .insert(users)
    .values([
      {
        email: "alistair.vance@apexsovereign.io",
        full_name: "Dr. Alistair Vance",
      },
      {
        email: "elena.rostova@apexsovereign.io",
        full_name: "Elena Rostova",
      },
      {
        email: "marcus.sterling@apexsovereign.io",
        full_name: "Marcus Sterling",
      },
    ])
    .returning();

  if (!user1_1 || !user1_2 || !user1_3) throw new Error("Failed to seed Org 1 users");

  await customDb.insert(organizationMembers).values([
    {
      organization_id: org1.id,
      user_id: user1_1.id,
      role: "owner",
    },
    {
      organization_id: org1.id,
      user_id: user1_2.id,
      role: "admin",
    },
    {
      organization_id: org1.id,
      user_id: user1_3.id,
      role: "member",
    },
  ]);

  const rawInviteToken = "mcv_invite_sample_token_apex_7days";
  const tokenHash = crypto.createHash("sha256").update(rawInviteToken).digest("hex");
  const [sampleInvite] = await customDb
    .insert(invitations)
    .values({
      organization_id: org1.id,
      email: "candidate.engineer@apexsovereign.io",
      role: "member",
      token_hash: tokenHash,
      invited_by: user1_1.id,
      status: "pending",
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7-day expiration
    })
    .returning();

  const [ws1_prod, ws1_sandbox] = await customDb
    .insert(workspaces)
    .values([
      {
        organization_id: org1.id,
        name: "Apex Primary Production",
        slug: "apex-prod",
        environment_type: "production",
        api_key_prefix: "mcv_live_apex_",
        api_key_hash: crypto
          .createHash("sha256")
          .update("apex_prod_key_live_secret_1")
          .digest("hex"),
      },
      {
        organization_id: org1.id,
        name: "Apex Vector Sandbox",
        slug: "apex-sandbox",
        environment_type: "sandbox",
        api_key_prefix: "mcv_test_apex_",
        api_key_hash: crypto
          .createHash("sha256")
          .update("apex_test_key_sandbox_secret_2")
          .digest("hex"),
      },
    ])
    .returning();

  const [quote1] = await customDb
    .insert(quotes)
    .values({
      organization_id: org1.id,
      quote_number: "MCV-Q-2026-001",
      tier: "vector_sovereign",
      seats: 25,
      currency: "USD",
      subtotal_minor: 15000000, // $150,000.00 in minor units (cents)
      discount_minor: 0,
      tax_minor: 0,
      total_minor: 15000000,
      status: "accepted",
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    .returning();

  if (!quote1) throw new Error("Failed to seed Quote 1");

  const [license1] = await customDb
    .insert(licenses)
    .values({
      organization_id: org1.id,
      quote_id: quote1.id,
      license_key: "MCV-LIC-APEX-SOVEREIGN-9921",
      tier: "vector_sovereign",
      status: "active",
      valid_from: new Date(),
      valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      entitlements: {
        maxVectors: 10000000,
        dedicatedNodes: 8,
        slaTier: "tier1_mission_critical",
      },
    })
    .returning();

  const [inv1] = await customDb
    .insert(invoices)
    .values({
      organization_id: org1.id,
      quote_id: quote1.id,
      invoice_number: "INV-2026-0001",
      stripe_payment_intent_id: "pi_apex_sample_intent_001",
      amount_due_minor: 15000000,
      amount_paid_minor: 15000000,
      currency: "USD",
      status: "paid",
      paid_at: new Date(),
    })
    .returning();

  if (!inv1) throw new Error("Failed to seed Invoice 1");

  await customDb.insert(storageFiles).values([
    {
      organization_id: org1.id,
      uploaded_by: user1_1.id,
      file_name: "apex_enterprise_master_agreement_2026.pdf",
      storage_path: `organizations/${org1.id}/contracts/apex_master_agreement_2026.pdf`,
      file_size_bytes: 2458120,
      mime_type: "application/pdf",
      category: "contract",
      is_private: true,
      checksum_sha256: crypto.createHash("sha256").update("apex_contract_content").digest("hex"),
    },
    {
      organization_id: org1.id,
      uploaded_by: user1_2.id,
      file_name: "vector_cluster_topology_spec.json",
      storage_path: `organizations/${org1.id}/blueprints/vector_cluster_topology_spec.json`,
      file_size_bytes: 18420,
      mime_type: "application/json",
      category: "blueprint",
      is_private: true,
      checksum_sha256: crypto.createHash("sha256").update("apex_blueprint_content").digest("hex"),
    },
  ]);

  await customDb.insert(auditLogs).values([
    {
      organization_id: org1.id,
      actor_id: user1_1.id,
      action: "organization.created",
      resource_type: "organization",
      resource_id: org1.id,
      metadata: { initiatedBy: "Alistair Vance" },
    },
    {
      organization_id: org1.id,
      actor_id: user1_3.id,
      action: "invoice.settled",
      resource_type: "invoice",
      resource_id: inv1.id,
      metadata: { amountMinor: 15000000, currency: "USD" },
    },
  ]);

  // ---------------------------------------------------------------------------
  // ORGANIZATION 2: Helios Global Vector Inc
  // ---------------------------------------------------------------------------
  const [org2] = await customDb
    .insert(organizations)
    .values({
      name: "Helios Global Vector Inc",
      slug: "helios-vector",
      status: "active",
      domain: "heliosvector.com",
    })
    .returning();

  if (!org2) throw new Error("Failed to seed Organization 2");

  const [user2_1, user2_2, user2_3] = await customDb
    .insert(users)
    .values([
      {
        email: "sophia.chen@heliosvector.com",
        full_name: "Sophia Chen",
      },
      {
        email: "liam.oconnor@heliosvector.com",
        full_name: "Liam O'Connor",
      },
      {
        email: "chloe.dubois@heliosvector.com",
        full_name: "Chloe Dubois",
      },
    ])
    .returning();

  if (!user2_1 || !user2_2 || !user2_3) throw new Error("Failed to seed Org 2 users");

  await customDb.insert(organizationMembers).values([
    {
      organization_id: org2.id,
      user_id: user2_1.id,
      role: "owner",
    },
    {
      organization_id: org2.id,
      user_id: user2_2.id,
      role: "admin",
    },
    {
      organization_id: org2.id,
      user_id: user2_3.id,
      role: "viewer",
    },
  ]);

  await customDb.insert(workspaces).values([
    {
      organization_id: org2.id,
      name: "Helios Cloud Primary",
      slug: "helios-prod",
      environment_type: "production",
      api_key_prefix: "mcv_live_helios_",
      api_key_hash: crypto
        .createHash("sha256")
        .update("helios_prod_key_live_secret_1")
        .digest("hex"),
    },
    {
      organization_id: org2.id,
      name: "Helios Staging Gateway",
      slug: "helios-stage",
      environment_type: "staging",
      api_key_prefix: "mcv_stage_helios_",
      api_key_hash: crypto.createHash("sha256").update("helios_stage_key_secret_2").digest("hex"),
    },
  ]);

  const [quote2] = await customDb
    .insert(quotes)
    .values({
      organization_id: org2.id,
      quote_number: "MCV-Q-2026-002",
      tier: "enterprise_standard",
      seats: 10,
      currency: "USD",
      subtotal_minor: 6500000, // $65,000.00 in minor units (cents)
      discount_minor: 0,
      tax_minor: 0,
      total_minor: 6500000,
      status: "accepted",
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    .returning();

  if (!quote2) throw new Error("Failed to seed Quote 2");

  await customDb.insert(licenses).values({
    organization_id: org2.id,
    quote_id: quote2.id,
    license_key: "MCV-LIC-HELIOS-GLOBAL-4418",
    tier: "enterprise_standard",
    status: "active",
    valid_from: new Date(),
    valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    entitlements: {
      maxVectors: 2500000,
      dedicatedNodes: 3,
      slaTier: "tier2_business_critical",
    },
  });

  const [inv2] = await customDb
    .insert(invoices)
    .values({
      organization_id: org2.id,
      quote_id: quote2.id,
      invoice_number: "INV-2026-0002",
      stripe_payment_intent_id: "pi_helios_sample_intent_002",
      amount_due_minor: 6500000,
      amount_paid_minor: 6500000,
      currency: "USD",
      status: "paid",
      paid_at: new Date(),
    })
    .returning();

  if (!inv2) throw new Error("Failed to seed Invoice 2");

  await customDb.insert(storageFiles).values([
    {
      organization_id: org2.id,
      uploaded_by: user2_1.id,
      file_name: "helios_saas_license_2026.pdf",
      storage_path: `organizations/${org2.id}/contracts/helios_saas_license_2026.pdf`,
      file_size_bytes: 1823100,
      mime_type: "application/pdf",
      category: "contract",
      is_private: true,
      checksum_sha256: crypto.createHash("sha256").update("helios_contract_content").digest("hex"),
    },
  ]);

  await customDb.insert(auditLogs).values([
    {
      organization_id: org2.id,
      actor_id: user2_1.id,
      action: "organization.created",
      resource_type: "organization",
      resource_id: org2.id,
      metadata: { initiatedBy: "Sophia Chen" },
    },
    {
      organization_id: org2.id,
      actor_id: user2_3.id,
      action: "invoice.settled",
      resource_type: "invoice",
      resource_id: inv2.id,
      metadata: { amountMinor: 6500000, currency: "USD" },
    },
  ]);

  console.log("Database seed completed successfully.");
  console.log(
    `Seeded Organization 1: ${org1.name} (${org1.id}) with 3 users, workspaces, quotes, licenses, invoices, files, and audit logs.`,
  );
  console.log(
    `Seeded Organization 2: ${org2.name} (${org2.id}) with 3 users, workspaces, quotes, licenses, invoices, files, and audit logs.`,
  );

  return {
    org1: {
      org: org1,
      users: [user1_1, user1_2, user1_3],
      workspaces: [ws1_prod, ws1_sandbox],
      quote: quote1,
      license: license1,
      invite: sampleInvite,
      rawInviteToken,
    },
    org2: { org: org2, users: [user2_1, user2_2, user2_3] },
  };
}

if (process.argv[1]?.endsWith("seed.ts")) {
  runSeed()
    .then(async () => {
      await closeDbPool();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("Seed execution failed:", err);
      await closeDbPool();
      process.exit(1);
    });
}
