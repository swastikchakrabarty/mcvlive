# Morland Chambers Vector (MCV) — API Conventions & Standardization Specification

**Document Version:** 1.0.0  
**Status:** Approved / Active Baseline  
**Classification:** Enterprise Engineering Documentation  
**Layer:** Layer 5 — APIs & Backend Logic

---

## 1. RESTful URI Design & Resource Naming Conventions

All API route handlers under `/api/` must strictly conform to the following uniform resource identifier (URI) naming standards:

1. **Plural Nouns for Resource Collections**:
   - `/api/workspaces` (not `/api/workspace`)
   - `/api/quotes`
   - `/api/licenses`
   - `/api/team/members`
2. **Kebab-Case for Multi-Word Segments**:
   - `/api/team/transfer-ownership`
   - `/api/storage/presigned-upload`
   - `/api/billing/webhook`
3. **Hierarchical Sub-Resources**:
   - `/api/team/members/:userId`
   - `/api/workspaces/:workspaceId`
4. **Action Endpoints as Explicit Verbs**:
   - `/api/team/invites/accept`
   - `/api/team/leave`
5. **No Trailing Slashes**:
   - URLs must never conclude with a trailing slash (`/api/workspaces`, not `/api/workspaces/`).

---

## 2. Standardized JSON Response Envelopes

Every API endpoint must return a structured JSON response wrapped in one of two standardized response envelopes. Direct, un-enveloped JSON payloads are prohibited.

### 2.1 Standard Success Envelope

```json
{
  "success": true,
  "data": {
    "id": "e3b0c442-98fc-1c14-9afb-4c7b8e5c1234",
    "name": "Production Core Workspace",
    "slug": "prod-core",
    "environmentType": "production"
  },
  "meta": {
    "timestamp": "2026-11-10T18:05:00.000Z",
    "requestId": "req_01hgb... (optional)"
  }
}
```

### 2.2 Standard Paginated List Envelope (Cursor-Based)

```json
{
  "success": true,
  "data": [
    { "id": "uuid-1", "name": "Item 1" },
    { "id": "uuid-2", "name": "Item 2" }
  ],
  "meta": {
    "timestamp": "2026-11-10T18:05:00.000Z",
    "cursor": {
      "nextCursor": "ZXlKaGJHY2lPaUpTVXpVeE5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjFa...",
      "hasMore": true,
      "limit": 20
    }
  }
}
```

### 2.3 Standard Error Envelope

Stack traces, internal database schema details, or raw server runtime exceptions must **never** be exposed in client responses.

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload: 2 fields failed validation checks",
    "details": [
      {
        "field": "seats",
        "message": "Expected integer greater than 0"
      },
      {
        "field": "tier",
        "message": "Invalid enum value. Expected 'starter' | 'enterprise_standard' | 'vector_sovereign'"
      }
    ],
    "timestamp": "2026-11-10T18:05:00.000Z"
  }
}
```

---

## 3. Standard Error Code Registry

| Error Code             | HTTP Status | Description & Use Case                                                        |
| :--------------------- | :---------: | :---------------------------------------------------------------------------- |
| `BAD_REQUEST`          |     400     | Malformed JSON syntax, invalid body parse, or unparseable input.              |
| `VALIDATION_ERROR`     |     400     | Zod schema validation failure on request body, params, or query.              |
| `UNAUTHORIZED`         |     401     | Missing authentication header, invalid bearer token, or revoked session.      |
| `FORBIDDEN`            |     403     | Authenticated user lacks RBAC permission (`can()` returned `false`).          |
| `NOT_FOUND`            |     404     | Resource does not exist **OR belongs to a foreign organization** (Anti-BOLA). |
| `CONFLICT`             |     409     | State conflict (e.g. duplicate email, unique slug collision).                 |
| `UNPROCESSABLE_ENTITY` |     422     | Semantic business rule violation (e.g. demoting last remaining Owner).        |
| `RATE_LIMITED`         |     429     | Request rate exceeded allowable quota.                                        |
| `INTERNAL_ERROR`       |     500     | Unhandled server error (details logged to Sentry, masked from response).      |

---

## 4. Input Validation & Boundaries

1. **Mandatory Zod Schemas**:
   - Every route handler that accepts a request body or search parameters must execute validation via Zod prior to invoking domain logic.
2. **Garbage & Malformed JSON Protection**:
   - Any request with an unparseable body must be intercepted cleanly, returning HTTP 400 with error code `BAD_REQUEST`.
3. **Cursor Validation**:
   - Pagination cursors must be opaque, tamper-evident base64 tokens decoding to `{ id: string, createdAt: string }`.

---

## 5. HTTP Status Code Utilization

- **200 OK**: Successful GET, PATCH, or PUT operations.
- **201 Created**: Successful POST resulting in resource creation.
- **202 Accepted**: Asynchronous background job queued.
- **204 No Content**: Successful DELETE with no response payload.
- **400 Bad Request**: Client-side validation or JSON syntax failure.
- **401 Unauthorized**: Authentication failure.
- **403 Forbidden**: Role capability deficiency.
- **404 Not Found**: Resource non-existence or foreign organization tenancy.
- **409 Conflict**: Unique constraint violation.
- **500 Internal Server Error**: Unhandled internal exception.
