import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import fs from "node:fs";
import path from "node:path";
import {
  Button,
  Input,
  Select,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui";

describe("Layer 6: Frontend Design System & Component State Tests", () => {
  describe("Button Component States & WCAG Compliance", () => {
    it("renders primary button with 10% high-contrast accent styling and accessible focus", () => {
      const html = renderToString(
        React.createElement(Button, { variant: "primary", size: "md" }, "Transact"),
      );
      expect(html).toContain("bg-indigo-600");
      expect(html).toContain("focus-visible:ring-2");
      expect(html).toContain("focus-visible:ring-indigo-500");
      expect(html).toContain("Transact");
    });

    it("renders loading state with spinner and aria-busy=true while disabling button", () => {
      const html = renderToString(
        React.createElement(
          Button,
          { variant: "primary", isLoading: true },
          "Submitting Requirements",
        ),
      );
      expect(html).toContain('aria-busy="true"');
      expect(html).toContain("disabled");
      expect(html).toContain("animate-spin");
    });

    it("renders secondary and surface variants conforming to 30% structural tone", () => {
      const html = renderToString(
        React.createElement(Button, { variant: "secondary" }, "Secondary Action"),
      );
      expect(html).toContain("bg-slate-900");
      expect(html).toContain("border-slate-700");
    });
  });

  describe("Input & Select Components: Labels & Inline Validation", () => {
    it("renders input with proper label association and accessible hint", () => {
      const html = renderToString(
        React.createElement(Input, {
          id: "test-email",
          label: "Corporate Email",
          hint: "Must be institutional domain",
        }),
      );
      expect(html).toContain('for="test-email"');
      expect(html).toContain("Corporate Email");
      expect(html).toContain("Must be institutional domain");
      expect(html).toContain('aria-invalid="false"');
    });

    it("renders input error state with role=alert, aria-invalid=true, and aria-describedby", () => {
      const html = renderToString(
        React.createElement(Input, {
          id: "test-err-field",
          label: "Vector Dimension",
          error: "Dimension must be 1536 or 3072",
        }),
      );
      expect(html).toContain('aria-invalid="true"');
      expect(html).toContain('aria-describedby="test-err-field-error"');
      expect(html).toContain('role="alert"');
      expect(html).toContain("border-rose-500");
      expect(html).toContain("Dimension must be 1536 or 3072");
    });

    it("renders select control with options and visible focus states", () => {
      const html = renderToString(
        React.createElement(Select, {
          id: "test-select",
          label: "Algorithm",
          options: [
            { value: "hnsw", label: "HNSW Dense" },
            { value: "ivf", label: "IVF-PQ" },
          ],
        }),
      );
      expect(html).toContain("HNSW Dense");
      expect(html).toContain("IVF-PQ");
      expect(html).toContain("focus-visible:ring-indigo-500");
    });
  });

  describe("Responsive Table Component", () => {
    it("renders with horizontal overflow-x-auto wrapper for 375px mobile responsiveness", () => {
      const html = renderToString(
        React.createElement(
          Table,
          null,
          React.createElement(
            TableHeader,
            null,
            React.createElement(
              TableRow,
              null,
              React.createElement(TableHead, null, "Cluster"),
              React.createElement(TableHead, null, "Latency"),
            ),
          ),
          React.createElement(
            TableBody,
            null,
            React.createElement(
              TableRow,
              null,
              React.createElement(TableCell, null, "UK-LON-01"),
              React.createElement(TableCell, null, "3.2ms"),
            ),
          ),
        ),
      );
      expect(html).toContain("overflow-x-auto");
      expect(html).toContain("UK-LON-01");
      expect(html).toContain("3.2ms");
    });
  });

  describe("The 4 Comprehensive Screen States", () => {
    it("renders State 1 (Loading): Skeletons with pulse animations", () => {
      const baseSkeletonHtml = renderToString(React.createElement(Skeleton, { variant: "text" }));
      expect(baseSkeletonHtml).toContain("animate-pulse");

      const cardSkeletonHtml = renderToString(React.createElement(CardSkeleton));
      expect(cardSkeletonHtml).toContain("animate-pulse");
      expect(cardSkeletonHtml).toContain('aria-hidden="true"');

      const tableSkeletonHtml = renderToString(React.createElement(TableSkeleton, { rows: 3 }));
      expect(tableSkeletonHtml).toContain("animate-pulse");
    });

    it("renders State 2 (Empty): Helpful message and primary call to action", () => {
      const html = renderToString(
        React.createElement(EmptyState, {
          title: "No Indices Provisioned",
          description: "Initialize your first tenant vector partition.",
          action: React.createElement(Button, { variant: "primary" }, "Provision Now"),
        }),
      );
      expect(html).toContain("No Indices Provisioned");
      expect(html).toContain("Initialize your first tenant vector partition.");
      expect(html).toContain("Provision Now");
    });

    it("renders State 3 (Error): Error code badge, explanatory text, and retry button", () => {
      const html = renderToString(
        React.createElement(ErrorState, {
          errorCode: "CLUSTER_TIMEOUT_504",
          title: "Connection Gateway Failure",
          message: "Unable to establish TLS handshake with Frankfurt-01.",
          onRetry: () => {},
        }),
      );
      expect(html).toContain('role="alert"');
      expect(html).toContain("CLUSTER_TIMEOUT_504");
      expect(html).toContain("Connection Gateway Failure");
      expect(html).toContain("Retry Request");
    });

    it("renders State 4 (Success): Data-rich table with active status", () => {
      const html = renderToString(
        React.createElement(
          Table,
          null,
          React.createElement(
            TableBody,
            null,
            React.createElement(
              TableRow,
              null,
              React.createElement(TableCell, null, "Apex Sovereign Core"),
              React.createElement(TableCell, null, "Active · 3.8ms"),
            ),
          ),
        ),
      );
      expect(html).toContain("Apex Sovereign Core");
      expect(html).toContain("Active · 3.8ms");
    });
  });

  describe("Security Audit: Zero Client-Side Secret Leakage", () => {
    it("ensures public frontend bundles contain zero private server secrets", () => {
      const frontendFiles = [
        "src/app/page.tsx",
        "src/app/design/page.tsx",
        "src/app/dashboard/page.tsx",
        "src/components/home/contact-form.tsx",
        "src/components/home/pricing-section.tsx",
        "src/components/home/telemetry-radar.tsx",
        "src/components/luxury/luxury-nav.tsx",
        "src/components/luxury/billing-tiers.tsx",
        "src/components/luxury/luxury-contact-form.tsx",
        "src/components/ui/button.tsx",
        "src/components/ui/modal.tsx",
        "src/components/ui/toast.tsx",
      ];

      const sensitiveTokens = [
        "DATABASE_URL",
        "STRIPE_SECRET_KEY",
        "CLERK_SECRET_KEY",
        "AWS_SECRET_ACCESS_KEY",
        "POSTGRES_PASSWORD",
        "STRIPE_WEBHOOK_SECRET",
      ];

      for (const relPath of frontendFiles) {
        const fullPath = path.resolve(process.cwd(), relPath);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, "utf-8");
          for (const token of sensitiveTokens) {
            expect(
              content.includes(`process.env.${token}`),
              `Security violation: ${token} referenced in client file ${relPath}`,
            ).toBe(false);
          }
        }
      }
    });
  });

  describe("Dynamic Luxury Dark & Luminous Aesthetic & Glassmorphism in CSS", () => {
    it("defines dynamic luxury obsidian dark base, champagne gold accents, and ambient lighting utilities", () => {
      const cssPath = path.resolve(process.cwd(), "src/app/globals.css");
      const cssContent = fs.readFileSync(cssPath, "utf-8");

      expect(cssContent).toContain("--luxury-base: #0a0a0c");
      expect(cssContent).toContain("--luxury-gold: #e6c594");
      expect(cssContent).toContain(".luxury-glass");
      expect(cssContent).toContain(".ambient-hero-glow");
      expect(cssContent).toContain(".ambient-footer-glow");
    });
  });

  describe("Fixed Market Pricing & Billing Tiers Architecture", () => {
    it("verifies Tier 1 ($200 USD), Tier 2 ($800 USD), and Tier 3 ($2,500 USD fixed)", async () => {
      const { BILLING_TIERS } = await import("@/components/luxury/billing-tiers");

      // Verify Tier 1: Landing Page ($200 USD)
      const tier1 = BILLING_TIERS.find((t) => t.id === "landing_page");
      expect(tier1).toBeDefined();
      expect(tier1?.price).toBe("$200");
      expect(tier1?.currency).toBe("USD");
      expect(
        tier1?.highlights.some((h) => h.includes("High-conversion bespoke single-page storefront")),
      ).toBe(true);
      expect(tier1?.highlights.some((h) => h.includes("SSL/TLS"))).toBe(true);
      expect(tier1?.highlights.some((h) => h.includes("DDoS"))).toBe(true);
      expect(
        tier1?.highlights.some((h) => h.includes("sub-100ms") || h.includes("Sub-100ms")),
      ).toBe(true);
      expect(tier1?.highlights.some((h) => h.includes("Zod-validated"))).toBe(true);

      // Verify Tier 2: E-Commerce Store ($800 USD)
      const tier2 = BILLING_TIERS.find((t) => t.id === "ecommerce_store");
      expect(tier2).toBeDefined();
      expect(tier2?.price).toBe("$800");
      expect(tier2?.currency).toBe("USD");
      expect(tier2?.isPriority).toBe(true);
      expect(tier2?.highlights.some((h) => h.includes("Full product catalog"))).toBe(true);
      expect(tier2?.highlights.some((h) => h.includes("Stripe & PayPal"))).toBe(true);
      expect(tier2?.highlights.some((h) => h.includes("inventory tracking"))).toBe(true);
      expect(tier2?.highlights.some((h) => h.includes("PostgreSQL"))).toBe(true);

      // Verify Tier 3: Complete Enterprise System ($2,500 USD fixed)
      const tier3 = BILLING_TIERS.find((t) => t.id === "complete_enterprise");
      expect(tier3).toBeDefined();
      expect(tier3?.price).toBe("$2,500");
      expect(tier3?.currency).toBe("USD");
      expect(tier3?.price.includes("-")).toBe(false); // No range permitted
      expect(tier3?.highlights.some((h) => h.includes("RBAC"))).toBe(true);
      expect(tier3?.highlights.some((h) => h.includes("admin dashboard"))).toBe(true);
      expect(
        tier3?.highlights.some(
          (h) => h.includes("hospital, library") || h.includes("management modules"),
        ),
      ).toBe(true);
      expect(tier3?.highlights.some((h) => h.includes("AES-256"))).toBe(true);
      expect(tier3?.highlights.some((h) => h.includes("audit logs"))).toBe(true);
    });
  });

  describe("Playbook Layer 10: Production Security Response Headers", () => {
    it("configures strict security response headers in next.config.ts", async () => {
      const nextConfigModule = await import("../next.config");
      const nextConfig = nextConfigModule.default;

      expect(nextConfig.headers).toBeDefined();
      if (nextConfig.headers) {
        const headerRules = await nextConfig.headers();
        const globalRule = headerRules.find((r: { source: string }) => r.source === "/(.*)");
        expect(globalRule).toBeDefined();

        if (globalRule && globalRule.headers) {
          const headersMap = new Map<string, string>(
            globalRule.headers.map((h: { key: string; value: string }) => [h.key, h.value]),
          );

          // 1. Content Security Policy
          expect(headersMap.has("Content-Security-Policy")).toBe(true);
          const csp = headersMap.get("Content-Security-Policy") || "";
          expect(csp).toContain("default-src 'self'");
          expect(csp).toContain("frame-ancestors 'none'");

          // 2. Strict-Transport-Security (HSTS)
          expect(headersMap.has("Strict-Transport-Security")).toBe(true);
          expect(headersMap.get("Strict-Transport-Security")).toContain("max-age=63072000");

          // 3. X-Frame-Options
          expect(headersMap.get("X-Frame-Options")).toBe("DENY");

          // 4. X-Content-Type-Options
          expect(headersMap.get("X-Content-Type-Options")).toBe("nosniff");

          // 5. Referrer-Policy
          expect(headersMap.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");

          // 6. Permissions-Policy
          expect(headersMap.has("Permissions-Policy")).toBe(true);
        }
      }
    });
  });

  describe("Playbook Layer 16: Automated SEO, Dynamic Sitemap & Robots Configuration", () => {
    it("generates valid dynamic sitemap with canonical domain and public routes", async () => {
      const sitemapModule = await import("@/app/sitemap");
      const sitemap = sitemapModule.default();

      expect(Array.isArray(sitemap)).toBe(true);
      expect(sitemap.length).toBeGreaterThanOrEqual(3);

      const urls = sitemap.map((entry) => entry.url);
      expect(
        urls.some(
          (u) =>
            u === "https://morelandchambersvector.com" || u.includes("morelandchambersvector.com"),
        ),
      ).toBe(true);
      expect(urls.some((u) => u.includes("/design"))).toBe(true);
      expect(urls.some((u) => u.includes("/dashboard"))).toBe(true);

      for (const entry of sitemap) {
        expect(entry.lastModified).toBeDefined();
        expect(entry.changeFrequency).toBeDefined();
        expect(entry.priority).toBeDefined();
      }

      const rootEntry = sitemap.find(
        (entry) =>
          entry.url === "https://morelandchambersvector.com" ||
          entry.url.endsWith("morelandchambersvector.com"),
      );
      expect(rootEntry).toBeDefined();
      expect(rootEntry?.priority).toBe(1.0);
      expect(rootEntry?.changeFrequency).toBe("daily");
    });

    it("generates production robots.txt allowing public paths and blocking private API endpoints", async () => {
      const robotsModule = await import("@/app/robots");
      const robots = robotsModule.default();

      expect(robots.rules).toBeDefined();
      const rules = Array.isArray(robots.rules) ? robots.rules[0] : robots.rules;
      expect(rules).toBeDefined();
      expect(rules?.allow).toContain("/");
      expect(rules?.disallow).toContain("/api/");
      expect(robots.sitemap).toContain("/sitemap.xml");
    });
  });

  describe("Brand Identity & Public Asset Architecture", () => {
    it("ensures public/mcvlogo.png exists and is referenced in root metadata and LuxuryNav", () => {
      const logoPath = path.resolve(process.cwd(), "public/mcvlogo.png");
      expect(fs.existsSync(logoPath)).toBe(true);

      const layoutPath = path.resolve(process.cwd(), "src/app/layout.tsx");
      const layoutContent = fs.readFileSync(layoutPath, "utf-8");
      expect(layoutContent).toContain("/mcvlogo.png");
      expect(layoutContent).toContain("icon:");
      expect(layoutContent).toContain("shortcut:");
      expect(layoutContent).toContain("apple:");

      const navPath = path.resolve(process.cwd(), "src/components/luxury/luxury-nav.tsx");
      const navContent = fs.readFileSync(navPath, "utf-8");
      expect(navContent).toContain("/mcvlogo.png");
      expect(navContent).toContain('alt="Morland Chambers Vector Logo"');
    });
  });

  describe("Playbook Layer 13: Error Boundaries Architecture", () => {
    it("ensures error.tsx and global-error.tsx exist and provide luxury error isolation", () => {
      const errorBoundaryPath = path.resolve(process.cwd(), "src/app/error.tsx");
      const globalErrorPath = path.resolve(process.cwd(), "src/app/global-error.tsx");

      expect(fs.existsSync(errorBoundaryPath)).toBe(true);
      expect(fs.existsSync(globalErrorPath)).toBe(true);

      const errorContent = fs.readFileSync(errorBoundaryPath, "utf-8");
      expect(errorContent).toContain("Restore Runtime");
      expect(errorContent).toContain("CLIENT_ERROR_BOUNDARY_TRIGGERED");

      const globalErrorContent = fs.readFileSync(globalErrorPath, "utf-8");
      expect(globalErrorContent).toContain("<html");
      expect(globalErrorContent).toContain("<body");
      expect(globalErrorContent).toContain("Reinitialize Application");
    });
  });
});
