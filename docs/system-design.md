# Morland Chambers Vector (MCV) — System Design Document

**Document Version:** 1.0.0  
**Status:** Approved / Active Baseline  
**Classification:** Enterprise Engineering Documentation  
**Authors:** Principal Systems Engineer & Tech Lead

---

## 1. Executive Summary & Problem Statements

### 1.1 Context

Morland Chambers Vector (MCV) is an institutional-grade international corporate web architecture and software sales platform. Modern enterprise organizations requiring bespoke, highly performant web architectures and proprietary vector computing software face severe friction in evaluating, purchasing, provisioning, and governing complex technical assets across global jurisdictions.

### 1.2 Core Problem Statements

1. **Procurement & Architectural Evaluation Friction**: Traditional enterprise software sales cycles for advanced web architectures and vector solutions suffer from opaque pricing, manual quote generation, disconnected technical benchmarks, and slow sales cycles.
2. **Multi-Jurisdiction Compliance & Contracting**: Cross-border transactions require automated compliance, regionalized tax/VAT handling, strict identity verification, and tamper-evident audit logging.
3. **Multi-Tenant Isolation & Security**: Enterprise clients demand ironclad data separation, role-based access control (RBAC), organization-scoped credential management, and zero leakage between competing corporate entities on a shared cloud platform.
4. **Performance & Global Edge Latency**: Prospective buyers evaluating high-performance architectures expect sub-second interactions globally, requiring edge caching, streaming Server Components, and optimized relational data pipelines.

---

## 2. User Roles & Access Control Model

MCV implements strict Role-Based Access Control (RBAC) paired with tenant-level boundary enforcement.

```
       ┌────────────────────────────────────────────────────────┐
       │                Superadmin (MCV Ops)                    │
       │   - Global tenant governance & catalog administration │
       └───────────────────────────┬────────────────────────────┘
                                   │
       ┌───────────────────────────┴────────────────────────────┐
       │              Organization Context (Tenant)             │
       ├───────────────────────────┬────────────────────────────┤
       │ Organization Admin        │ Finance / Compliance       │
       │ - Manage seats & billing  │ - Invoicing & audit logs   │
       ├───────────────────────────┼────────────────────────────┤
       │ Technical Evaluator       │ Standard Member            │
       │ - API keys & deployments  │ - Read-only access         │
       └───────────────────────────┴────────────────────────────┘
```

| Role                              | Scope      | Key Permissions & Responsibilities                                                                                                  |
| :-------------------------------- | :--------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| **Anonymous Prospect**            | Public     | Browse public catalog, run interactive architectural calculators, inspect live performance benchmarks, submit sales inquiries.      |
| **Technical Evaluator**           | Org Scoped | Inspect architecture blueprints, test vector sandbox APIs, generate evaluation tokens, review integration documentation.            |
| **Enterprise Buyer / Admin**      | Org Scoped | Manage organization profile, invite team members, assign seat licenses, execute legal contracts, configure payment methods.         |
| **Finance & Compliance Officer**  | Org Scoped | Access tax invoices, download cryptographically verified receipts, review compliance certificates, inspect billing telemetry.       |
| **Platform Superadmin (MCV Ops)** | Global     | Platform-wide observability, global catalog management, tenant lifecycle moderation, dispute handling, feature-flag administration. |

---

## 3. Core User Flows

### 3.1 Flow 1: Architecture Discovery & Interactive Evaluation

1. Anonymous prospect navigates to the MCV showcase portal.
2. Edge network serves cached landing pages and vector architecture benchmarks with `<100ms` First Contentful Paint.
3. User selects architecture parameters (e.g., node density, regional latency thresholds, vector search dimensionalities).
4. System executes real-time cost estimation and benchmark simulations via client/server calculation engines.
5. Prospect inputs corporate domain to initiate evaluation tier.

### 3.2 Flow 2: Organization Onboarding & Identity Provisioning

1. User registers via Clerk / Supabase Auth using corporate SSO (SAML/Okta) or work email.
2. System triggers onboarding transaction: creates `organizations` record, assigns user as `Organization Admin`, establishes tenant boundaries.
3. Tenant isolation context is bound to user session JWT (`org_id`, `role`, `permissions`).
4. Automated verification check verifies domain reputational integrity and sanctions screening.

### 3.3 Flow 3: Software Licensing & Commerce Checkout

1. Organization Admin selects software licensing tier or custom vector configuration.
2. Server validates configuration schema via Zod and locks current pricing in an idempotent quote record.
3. User confirms terms; platform invokes Stripe Payment Gateway (PaymentIntent / SetupIntent).
4. Upon webhook verification (`payment_intent.succeeded`), platform generates an immutable cryptographically signed Software License Key and entitlements manifest.
5. Invoicing event triggers background generation of compliant PDF receipt and audit trail entry.

### 3.4 Flow 4: Workspace Deployment & Telemetry Monitoring

1. Client Technical Evaluator accesses the authenticated tenant workspace.
2. Evaluator generates tenant-scoped API credentials for vector endpoints and architectural repositories.
3. Client applications consume MCV services; distributed edge proxies authenticate requests against Upstash Redis rate-limiter.
4. Telemetry pipeline logs usage metrics into PostgreSQL for billing reconciliation and performance monitoring.

---

## 4. Multi-Tenancy Architecture & Organization Isolation

MCV utilizes a **Shared Database, Tenant-Partitioned Schema with Row-Level Security (RLS)** model.

```
+-----------------------------------------------------------------------+
|                            Incoming Request                           |
|  Headers: Authorization: Bearer <jwt>  |  x-tenant-id: <org_id>        |
+-----------------------------------┬-----------------------------------+
                                    │
                                    ▼
+-----------------------------------------------------------------------+
|                     Tenant Identification Middleware                  |
|  - Validates JWT session claims against request parameters             |
|  - Sets tenant context in execution scope                             |
+-----------------------------------┬-----------------------------------+
                                    │
                                    ▼
+-----------------------------------------------------------------------+
|                      PostgreSQL Connection Pool                       |
|  SET LOCAL app.current_tenant_id = 'org_abc123';                      |
|  Row-Level Security (RLS) Policy: tenant_id = app.current_tenant_id   |
+-----------------------------------------------------------------------+
```

### 4.1 Isolation Guarantees

- **Data Scoping**: Every multi-tenant database table contains a non-nullable `tenant_id` foreign key indexed for rapid lookup.
- **Database Row-Level Security**: PostgreSQL RLS policies enforce `tenant_id = current_setting('app.current_tenant_id')` on all `SELECT`, `INSERT`, `UPDATE`, and `DELETE` operations.
- **Service Layer Boundary**: All data-access repositories take an explicit `TenantContext` parameter; repository methods reject un-scoped queries.
- **Rate-Limiting Partitioning**: Upstash Redis keys are partitioned by `ratelimit:{tenant_id}:{endpoint}` to prevent any single tenant from exhausting shared API capacity.

---

## 5. Data Sensitivity & Classification

Data managed within MCV is categorized into four distinct security tiers:

| Tier       | Classification            | Examples                                                                                                    | Storage & Encryption Controls                                                                                                                           |
| :--------- | :------------------------ | :---------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Tier 1** | **Restricted / Critical** | Payment tokens, Clerk secret keys, database credentials, tenant license signing keys, master API secrets.   | Encrypted at rest via AES-256; encrypted in transit via TLS 1.3. Strictly excluded from application logs; stored in Vercel Encrypted Environment Store. |
| **Tier 2** | **Confidential**          | Customer PII, enterprise contracts, organization billing history, private vector deployment configurations. | PostgreSQL with RLS, restricted by organizational boundaries; access logged to tamper-evident audit table.                                              |
| **Tier 3** | **Internal Operational**  | API request telemetry, server performance metrics, error traces, background job states.                     | Masked PII, retained for 90 days; monitored via Sentry and aggregated APM.                                                                              |
| **Tier 4** | **Public**                | Public software catalog, architecture whitepapers, documentation, marketing assets.                         | Stored in CDN cache and public object storage; publicly indexable.                                                                                      |

---

## 6. Year-One Scale Projections & System SLOs

### 6.1 Capacity Estimates (Year 1)

- **Active Organizations**: 1,500 enterprise tenants.
- **Monthly Active Evaluators / Users**: 25,000 MAU.
- **Daily Peak Request Volume**: 200 Requests Per Second (RPS) peak; 35 RPS baseline average.
- **Read to Write Ratio**: 85:15 (highly read-heavy for catalog, benchmarks, and documentation; writes concentrated in licensing, checkout, and telemetry).
- **Relational Storage Growth**: ~150 GB in PostgreSQL (year 1).
- **Telemetry & Event Log Volume**: ~1.2 TB annually (archived to cold storage after 90 days).

### 6.2 Service Level Objectives (SLOs)

- **Availability**: 99.95% uptime across global edge network and core APIs.
- **P95 Latency (Public Edge Pages)**: `< 120ms` globally.
- **P95 Latency (Dynamic Server API Handlers)**: `< 280ms`.
- **Maximum Data Recovery Point Objective (RPO)**: `< 5 minutes` (continuous WAL archiving via Supabase / Neon).
- **Recovery Time Objective (RTO)**: `< 30 minutes` for complete service restoration.

---

## 7. Out-of-Scope Items for Phase 1

To maintain strict execution focus and zero bloat during Phase 1, the following features and infrastructure are explicitly deferred:

1. **Bare-Metal On-Premises Appliances**: MCV will operate exclusively as a cloud-delivered SaaS/PaaS on Vercel and managed PostgreSQL.
2. **Cryptocurrency & Web3 Payment Settlement**: Payments will strictly use fiat payment rails via Stripe (Credit Card, ACH, SEPA wire transfer).
3. **Multi-Region Active-Active Relational Replication**: Cross-region distributed database clustering is unnecessary for Year 1 scale and introduces distributed transaction complexity; connection pooling and read replicas will be utilized.
4. **Custom In-App Video Conferencing**: Real-time sales calls will integrate external calendar and video conferencing platforms (e.g., Google Meet / Zoom) rather than custom WebRTC media servers.
