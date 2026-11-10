# Morland Chambers Vector (MCV) — Disaster Recovery & Backup Runbook

> **Document Classification:** Institutional Confidential · Layer 15/16 Operations  
> **Target Systems:** Primary PostgreSQL Database (Supabase/Neon/Self-Hosted), Lead Pipeline, Storage Vaults  
> **Last Verified:** November 10, 2026  
> **Author:** Principal Security & Infrastructure Engineering

---

## 1. Executive Summary & Recovery Objectives

Morland Chambers Vector (MCV) maintains an institutional-grade Business Continuity and Disaster Recovery (BCDR) strategy designed to withstand complete availability zone outages, catastrophic database corruption, or malicious tampering.

### Service Level Objectives (SLOs)

| Metric                             | Target                    | Operational Guarantee                                                                                                    |
| :--------------------------------- | :------------------------ | :----------------------------------------------------------------------------------------------------------------------- |
| **Recovery Point Objective (RPO)** | **< 5 Minutes**           | Continuous WAL archiving ensures maximum potential data loss is under 5 minutes under catastrophic primary failure.      |
| **Recovery Time Objective (RTO)**  | **< 15 Minutes**          | Automated cloud provisioning and point-in-time recovery scripts restore full transactional operations within 15 minutes. |
| **Data Durability**                | **99.999999999% (11 9s)** | Multi-region, geo-redundant object storage with object locking and versioning.                                           |
| **Uptime Commitment**              | **99.999%**               | Multi-tenant architecture with high-availability standby failover.                                                       |

---

## 2. PostgreSQL Storage & Connection Pooling Architecture

- **Primary Persistence:** PostgreSQL 16+ with strict Row-Level Security (RLS) and multi-tenant schema isolation (`organization_id` foreign keys with cascade rules).
- **Connection Pooling:** Managed via native `pg.Pool` / PgBouncer:
  - Maximum client pool: `20` in production (`10` in development).
  - Idle client timeout: `30,000 ms` (30 seconds).
  - Handshake connection timeout: `5,000 ms` (5 seconds).
- **Soft Delete Protocol:** Every database entity (organizations, workspaces, users, quotes, licenses, invoices, files, audit logs, and `leads`) enforces non-destructive soft deletion via indexed `deleted_at` timestamps for tenant recovery.

---

## 3. Continuous Write-Ahead Log (WAL) Archiving

Continuous WAL archiving captures every single database transaction in real-time and streams compressed WAL segments to an off-site, sovereign cloud bucket.

### PostgreSQL Configuration (`postgresql.conf`)

```ini
# ==============================================================================
# MCV Sovereign WAL Archiving Configuration
# ==============================================================================
wal_level = replica
archive_mode = on
archive_command = 'envdir /etc/wal-e.d/env wal-g wal-push %p'
archive_timeout = 300 # Forces segment rotation every 5 minutes (enforces 5m RPO)
```

### Sovereign Storage Destination

- **Primary Bucket:** `s3://mcv-sovereign-vault-lon/wal/` (AWS London eu-west-2)
- **Replica Bucket:** `s3://mcv-sovereign-vault-zrh/wal/` (AWS Zurich eu-central-2)
- **Encryption:** Server-Side Encryption with Customer-Managed Keys (SSE-KMS / AES-256).
- **Immutability:** S3 Object Lock in Compliance Mode (WORM: Write Once, Read Many) for 90 days.

---

## 4. Daily Automated Snapshot Cadence

Full logical and physical snapshots are generated autonomously according to the schedule below:

| Frequency                 | Execution Time           | Target Storage                 | Retention Window     |
| :------------------------ | :----------------------- | :----------------------------- | :------------------- |
| **Daily Full Backup**     | `02:00 UTC`              | `s3://mcv-backups-lon/daily/`  | 30 Days Rolling      |
| **Weekly Consolidation**  | `Sunday 03:00 UTC`       | `s3://mcv-backups-lon/weekly/` | 90 Days Rolling      |
| **Monthly Vault Archive** | `1st of Month 04:00 UTC` | `s3://mcv-cold-vault/monthly/` | 7 Years (Compliance) |

### Automated Backup Command

```bash
#!/usr/bin/env bash
set -euo pipefail

TIMESTAMP=$(date -u +%Y%m%d_%H%M%SZ)
BACKUP_FILE="/tmp/mcv_backup_${TIMESTAMP}.dump"

echo "[MCV-BACKUP] Initiating pg_dump snapshot at ${TIMESTAMP}..."
PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump \
  -h "${POSTGRES_HOST}" \
  -U "${POSTGRES_USER}" \
  -d "${POSTGRES_DB}" \
  -Fc \
  -Z 9 \
  --exclude-table-data="audit_logs" \
  -f "${BACKUP_FILE}"

echo "[MCV-BACKUP] Uploading snapshot to sovereign storage vault..."
aws s3 cp "${BACKUP_FILE}" "s3://mcv-backups-lon/daily/mcv_${TIMESTAMP}.dump" \
  --sse aws:kms \
  --sse-kms-key-id "${MCV_KMS_KEY_ARN}"

rm -f "${BACKUP_FILE}"
echo "[MCV-BACKUP] Snapshot completed successfully."
```

---

## 5. Point-in-Time Recovery (PITR) Procedure

Execute this exact runbook when restoring the database to a specific millisecond timestamp (e.g., prior to a catastrophic incident at `2026-11-10 14:32:00 UTC`).

### Step 1: Provision Isolated Recovery Instance

Never restore directly over an active cluster. Provision a parallel instance:

```bash
export RECOVERY_TARGET_TIME="2026-11-10 14:32:00 UTC"
export RECOVERY_INSTANCE_DIR="/var/lib/postgresql/recovery_instance"

mkdir -p "${RECOVERY_INSTANCE_DIR}"
```

### Step 2: Fetch and Unpack Nearest Base Backup

```bash
wal-g backup-fetch "${RECOVERY_INSTANCE_DIR}" LATEST
```

### Step 3: Configure Recovery Signal & Target Time

```bash
touch "${RECOVERY_INSTANCE_DIR}/recovery.signal"

cat << EOF >> "${RECOVERY_INSTANCE_DIR}/postgresql.auto.conf"
restore_command = 'wal-g wal-fetch %f %p'
recovery_target_time = '${RECOVERY_TARGET_TIME}'
recovery_target_action = 'promote'
EOF
```

### Step 4: Launch Recovery Node & Monitor WAL Replay

```bash
pg_ctl -D "${RECOVERY_INSTANCE_DIR}" start
tail -f "${RECOVERY_INSTANCE_DIR}/log/postgresql.log"
```

Look for the confirmation event:

```
LOG: recovery stopping at restore point "2026-11-10 14:32:00+00"
LOG: redo done at 1A/B8470E0
LOG: database system was not properly shut down; automatic recovery in progress
LOG: database system is ready to accept read-only connections
LOG: promoted database to primary
```

### Step 5: Execute Automated Health & Isolation Verification

```bash
# Verify tenant isolation and schema invariants on recovered node
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/mcv_recovery" npm run test
```

### Step 6: Production Cutover

Update DNS / connection string in production Vercel edge deployment:

```bash
vercel env add DATABASE_URL production
vercel redeploy
```

---

## 6. Lead Pipeline & Email Redundancy Verification

The lead acquisition pipeline (`POST /api/contact`) incorporates an immutable off-site dual-write mechanism:

```mermaid
flowchart LR
    A["Prospect Ingress\n(morelandchambersvector.com)"] --> B["Zod Payload Validation\n& Rate Limiter Check"]
    B --> C["PostgreSQL Database\n(Table: leads)"]
    B --> D["Asynchronous Queue\n(send_email job)"]
    D --> E["Corporate Dispatch\ninfo@morelandchambers.com"]
    C --> F["Continuous WAL Archiving\n(S3 WORM Vault)"]
```

### Dual Redundancy Safeguard

1. **Transactional Database Write:** The record is committed into the PostgreSQL `leads` table with reference ID (`MCV-LEAD-XXXXXX`), timestamps, and client metadata.
2. **Asynchronous Corporate Dispatch:** Concurrently, an alert email is enqueued to `info@morelandchambers.com` via our durable background worker queue (`background_jobs`).
3. **Cold-Storage Verification:** Even in the theoretical total loss of the primary database cluster, every lead submitted exists in the corporate email infrastructure as an immutable external audit record with all customer requirements intact.

---

## 7. Disaster Recovery Drill Protocol

DR drills are scheduled biannually to prove RTO/RPO compliance:

1. **Drill Frequency:** Every 6 months (May & November).
2. **Success Criteria:**
   - PITR completed in $\le 15$ minutes.
   - Zero corrupted foreign keys or broken constraints.
   - 100% test suite pass rate on recovered instance (`npm run test`).
3. **Escalation Contacts:**
   - Principal Systems Architect: `systems@morelandchambers.com`
   - Security Operations: `security@morelandchambers.com`
   - Executive Escalation: `info@morelandchambers.com`
