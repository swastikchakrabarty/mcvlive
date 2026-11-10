# Morland Chambers Vector (MCV) — Role-Based Access Control (RBAC) & Authorization Specification

**Document Version:** 1.0.0  
**Status:** Approved / Active Baseline  
**Classification:** Enterprise Security Documentation  
**Layer:** Layer 4 — Authentication, Authorization & Identity Access Management (IAM)

---

## 1. Core Principles of Centralized Authorization

1. **Zero Ad-Hoc Role Checks**:
   - Conditional role logic (e.g. `if (user.role === 'admin')`) scattered across handlers or services is strictly prohibited.
   - All authorization decisions must pass through the centralized helper `can(user, action, resource)` and its assertive variant `assertCan(user, action, resource)`.
2. **Ironclad BOLA / IDOR Defense (Tenant Isolation Enforcement)**:
   - Every read and write operation targeting a tenant resource must verify that `resource.organization_id === user.activeOrganizationId`.
   - If a caller targets an object belonging to a foreign organization, the authorization engine **must throw HTTP 404 (`NotFoundError`)** rather than HTTP 403 (`ForbiddenError`). This prevents malicious attackers from enumerating or confirming the existence of foreign tenant assets (Zero Information Disclosure).
3. **Owner Protection Invariants**:
   - Every organization must have at least one active `Owner`.
   - The last remaining `Owner` cannot leave the organization or have their role revoked.
   - Ownership can only be transferred by the current `Owner`.
4. **Least Privilege Default**:
   - Any action not explicitly granted in the matrix below is denied by default (`false`).

---

## 2. Role Definitions

| Role       |   Hierarchy Level    | Description                                                                                                                            |
| :--------- | :------------------: | :------------------------------------------------------------------------------------------------------------------------------------- |
| **Owner**  |    Tier 1 (Apex)     | Full governance authority over organization lifecycle, billing, legal agreements, ownership transfer, and team hierarchy.              |
| **Admin**  | Tier 2 (Management)  | Operational control over team invitations, workspace management, and software licenses. Cannot modify owner or transfer ownership.     |
| **Member** | Tier 3 (Contributor) | Core engineering and operations access. Can create and configure workspaces, view licenses/quotes, and upload architectural documents. |
| **Viewer** |  Tier 4 (Read-Only)  | Strict read-only access for external auditors, evaluators, and stakeholders. Zero write, mutate, or invite permissions.                |

---

## 3. Permissions Matrix

| Resource               | Action                            | Owner | Admin | Member | Viewer | Invariants & Business Constraints                                   |
| :--------------------- | :-------------------------------- | :---: | :---: | :----: | :----: | :------------------------------------------------------------------ |
| **Organization**       | `organization:read`               |  ✅   |  ✅   |   ✅   |   ✅   | Scoped strictly to active organization.                             |
|                        | `organization:update`             |  ✅   |  ✅   |   ❌   |   ❌   | Org name, domain, branding settings.                                |
|                        | `organization:delete`             |  ✅   |  ❌   |   ❌   |   ❌   | Destructive soft-delete of tenant.                                  |
|                        | `organization:transfer_ownership` |  ✅   |  ❌   |   ❌   |   ❌   | Only Owner can appoint successor.                                   |
| **Team / Members**     | `member:read`                     |  ✅   |  ✅   |   ✅   |   ✅   | List active members and roles.                                      |
|                        | `member:invite`                   |  ✅   |  ✅   |   ❌   |   ❌   | Admin cannot invite as Owner.                                       |
|                        | `member:update_role`              |  ✅   |  ✅*  |   ❌   |   ❌   | *Admin can only edit Member/Viewer roles.                           |
|                        | `member:remove`                   |  ✅   |  ✅*  |   ❌   |   ❌   | *Admin cannot remove Owner or Admins. Last Owner cannot be removed. |
|                        | `member:leave`                    |  ✅*  |  ✅   |   ✅   |   ✅   | *Last remaining Owner cannot leave.                                 |
| **Workspaces**         | `workspace:read`                  |  ✅   |  ✅   |   ✅   |   ✅   | Read workspace environments.                                        |
|                        | `workspace:create`                |  ✅   |  ✅   |   ✅   |   ❌   | Deploy new environment/sandbox.                                     |
|                        | `workspace:update`                |  ✅   |  ✅   |   ✅   |   ❌   | Update API key, configurations.                                     |
|                        | `workspace:delete`                |  ✅   |  ✅   |   ❌   |   ❌   | Destroy workspace environment.                                      |
| **Quotes & Sales**     | `quote:read`                      |  ✅   |  ✅   |   ✅   |   ✅   | Review pricing quotes and tiers.                                    |
|                        | `quote:create`                    |  ✅   |  ✅   |   ❌   |   ❌   | Request custom architectural quote.                                 |
|                        | `quote:accept`                    |  ✅   |  ✅   |   ❌   |   ❌   | Accept commercial commitments.                                      |
| **Licenses**           | `license:read`                    |  ✅   |  ✅   |   ✅   |   ✅   | View software license keys.                                         |
|                        | `license:provision`               |  ✅   |  ✅   |   ❌   |   ❌   | Activate or re-issue license tokens.                                |
|                        | `license:revoke`                  |  ✅   |  ❌   |   ❌   |   ❌   | Revoke active enterprise licenses.                                  |
| **Storage / Files**    | `storage:read`                    |  ✅   |  ✅   |   ✅   |   ✅   | Generate pre-signed download URLs.                                  |
|                        | `storage:upload`                  |  ✅   |  ✅   |   ✅   |   ❌   | Generate pre-signed upload URLs.                                    |
|                        | `storage:delete`                  |  ✅   |  ✅   |   ❌   |   ❌   | Soft delete stored documents.                                       |
| **Billing & Invoices** | `billing:read`                    |  ✅   |  ✅   |   ❌   |   ❌   | Inspect tax invoices & receipts.                                    |
|                        | `billing:manage`                  |  ✅   |  ❌   |   ❌   |   ❌   | Modify Stripe payment methods.                                      |
| **Audit Logs**         | `audit_log:read`                  |  ✅   |  ✅   |   ❌   |   ❌   | Inspect tamper-evident audit trails.                                |

---

## 4. Central Authorization Interface

Every service and API route handler must execute authorization via the central engine:

```typescript
import { can, assertCan } from "@/modules/identity/authorization";

// 1. Boolean query check:
if (!can(authContext, "workspace:delete", workspace)) {
  // Gracefully hide UI button or return error
}

// 2. Strict assertive check (throws 403 Forbidden or 404 NotFound for foreign tenant object):
assertCan(authContext, "workspace:delete", workspace);
```
