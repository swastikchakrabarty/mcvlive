<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Morland Chambers Vector (MCV) — Project Memory & AI Operating Instructions

## 1. Product Description

Morland Chambers Vector (MCV) is a high-performance international corporate web architecture and software sales platform. It provides enterprise clients with an institutional-grade digital interface for evaluating, configuring, and procuring proprietary web architectures, bespoke vector solutions, software licensing tiers, and digital infrastructure blueprints across global jurisdictions.

---

## 2. Locked Architecture Stack

All systems, features, and modifications must strictly conform to the following locked technology stack. Unauthorized additions of core framework dependencies or deviations are strictly prohibited.

| Layer                       | Technology                     | Specification / Details                                                                                      |
| :-------------------------- | :----------------------------- | :----------------------------------------------------------------------------------------------------------- |
| **Frontend Framework**      | Next.js (App Router) + React   | Modern React Server Components (RSC), Streaming SSR, Client Components isolated to interaction leaves.       |
| **Styling & Design System** | Tailwind CSS                   | Utility-first responsive design, strict design tokens, accessible UI patterns.                               |
| **Primary Backend**         | Node.js                        | Next.js Route Handlers (`src/app/api/*`), Server Actions, domain services inside `src/modules/*`.            |
| **Secondary Backend**       | FastAPI (Python)               | Dedicated high-throughput microservice for vector computation and heavy AI inference tasks (when required).  |
| **Database & Persistence**  | PostgreSQL via Supabase / Neon | Relational schema with connection pooling (PgBouncer), strict Row-Level Security (RLS), and ACID guarantees. |
| **Authentication & IAM**    | Clerk / Supabase Auth          | Organization-aware multi-tenant identity, JWT session management, RBAC, and SSO/SAML integration.            |
| **Hosting & Edge Delivery** | Vercel                         | Global edge CDN, serverless functions, automatic preview deployments, and zero-downtime rolling releases.    |

---

## 3. Non-Negotiable Engineering Rules

1. **Absolute Secret Protection & Zero-Trust Secrets Management**:
   - Never commit raw secrets, API tokens, passwords, private keys, or environment files (`.env*`) to Git.
   - All environment variables must be defined and documented in `.env.example` with clear descriptions.
   - Environment variables must be validated at application boot via `src/common/config/env.ts` with explicit type safety.

2. **Mandatory Input Validation & Server-Side Authorization**:
   - Zero-trust architecture: Never trust client-supplied input. Every API route handler and server action must validate payloads using Zod schemas before processing.
   - Server-side authorization must be enforced on every endpoint. Verify tenant context, user session, and permission scopes before any database interaction or business operation.

3. **Strict TypeScript & Linter Zero-Tolerance**:
   - `tsconfig.json` runs in strict mode (`strict: true`, `noImplicitAny: true`, `strictNullChecks: true`, `noUncheckedIndexedAccess: true`).
   - The use of `any` is strictly prohibited; use `unknown` with runtime type narrowing or generic constraints.
   - Zero ESLint warnings or errors permitted in production builds or CI runs.

4. **Atomic, Reviewable Branch Changes**:
   - Keep pull requests tightly scoped and focused on a single architectural domain or capability.
   - Commit messages must follow conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`).
   - All tests, type checks, and lint checks must pass before opening or merging a branch.

5. **Modular Monolith Domain Boundaries**:
   - Code must reside in bounded contexts inside `src/modules/{domain}` (`identity`, `catalog`, `sales`, `tenancy`, `analytics`).
   - Cross-module communication must happen exclusively through public module interfaces (exported from each module's `index.ts`), never through deep internal imports.

---

## 4. Standard Operational & Development Commands

```bash
# -----------------------------------------------------------------------------
# Development & Build
# -----------------------------------------------------------------------------
npm run dev              # Launch local Next.js development server
npm run build            # Compile production Next.js build
npm run start            # Run production build locally

# -----------------------------------------------------------------------------
# Code Quality, Formatting & Static Analysis
# -----------------------------------------------------------------------------
npm run lint             # Execute ESLint across entire codebase
npm run lint:fix         # Auto-fix linting infractions where possible
npm run format           # Format all files using Prettier
npm run format:check     # Verify formatting compliance without modifying files
npm run typecheck        # Run TypeScript typechecker with noEmit

# -----------------------------------------------------------------------------
# Automated Testing
# -----------------------------------------------------------------------------
npm run test             # Run Vitest test suite once
npm run test:watch       # Run Vitest in interactive watch mode
npm run test:coverage    # Generate code coverage reports

# -----------------------------------------------------------------------------
# Database Management & Migrations (Prisma / Drizzle standard)
# -----------------------------------------------------------------------------
npm run db:generate      # Generate ORM client and TypeScript types
npm run db:migrate       # Apply pending database schema migrations
npm run db:push          # Push schema state directly in development
npm run db:studio        # Open interactive database browser GUI
```
