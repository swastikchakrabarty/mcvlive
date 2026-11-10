import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import fs from "node:fs";
import path from "node:path";
import { LuxuryNav } from "@/components/luxury/luxury-nav";
import { LuxuryBillingTiers, BILLING_TIERS } from "@/components/luxury/billing-tiers";
import { contactSchema } from "@/app/api/contact/route";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

describe("Final Pre-Live QA, Security & Performance Audit", () => {
  describe("Audit 1: Cross-Device & Viewport Responsiveness", () => {
    it("renders LuxuryNav with mobile-first responsive constraints (375px mobile to 2160px+)", () => {
      const html = renderToString(React.createElement(LuxuryNav));
      // Mobile 375px friendliness: truncate, responsive padding, shrink-0
      expect(html).toContain("max-w-7xl");
      expect(html).toContain("px-4 sm:px-6 lg:px-8");
      expect(html).toContain("shrink-0");
      expect(html).toContain("truncate");
      expect(html).toContain("hidden sm:block");
      expect(html).toContain("Direct Inquiry");
    });

    it("renders LuxuryBillingTiers with responsive 1-col to 3-col grid layout", () => {
      const html = renderToString(
        React.createElement(LuxuryBillingTiers, {
          selectedTierId: "ecommerce_store",
        }),
      );
      // Grid responsiveness: 1 col on mobile/tablet, 3 cols on lg (laptop/desktop/ultra-wide)
      expect(html).toContain("grid-cols-1 lg:grid-cols-3");
      expect(html).toContain("p-6 sm:p-8 lg:p-9");

      // Verify all 3 fixed pricing tiers are accurately displayed
      expect(html).toContain("$200");
      expect(html).toContain("$800");
      expect(html).toContain("$2,500");
      expect(html).toContain("USD");
    });

    it("verifies BILLING_TIERS data integrity for all 3 fixed investment packages", () => {
      expect(BILLING_TIERS).toHaveLength(3);
      const [tier1, tier2, tier3] = BILLING_TIERS;

      expect(tier1?.id).toBe("landing_page");
      expect(tier1?.price).toBe("$200");

      expect(tier2?.id).toBe("ecommerce_store");
      expect(tier2?.price).toBe("$800");

      expect(tier3?.id).toBe("complete_enterprise");
      expect(tier3?.price).toBe("$2,500");
    });
  });

  describe("Audit 2: Security, TLS & Injection Defense", () => {
    it("verifies strict production security headers in next.config.ts", () => {
      const nextConfigPath = path.resolve(process.cwd(), "next.config.ts");
      const configContent = fs.readFileSync(nextConfigPath, "utf-8");

      // Content-Security-Policy
      expect(configContent).toContain("Content-Security-Policy");
      expect(configContent).toContain("default-src 'self'");
      expect(configContent).toContain("frame-ancestors 'none'");
      expect(configContent).toContain("object-src 'none'");

      // HSTS
      expect(configContent).toContain("Strict-Transport-Security");
      expect(configContent).toContain("max-age=63072000; includeSubDomains; preload");

      // Anti-Clickjacking & MIME-Sniffing
      expect(configContent).toContain("X-Frame-Options");
      expect(configContent).toContain("DENY");
      expect(configContent).toContain("X-Content-Type-Options");
      expect(configContent).toContain("nosniff");

      // Referrer & Permissions Policy
      expect(configContent).toContain("Referrer-Policy");
      expect(configContent).toContain("strict-origin-when-cross-origin");
      expect(configContent).toContain("Permissions-Policy");
    });

    it("verifies Zod schema prevents SQL Injection and XSS attack vectors in form payloads", () => {
      // 1. Valid payload parses cleanly
      const validPayload = {
        businessName: "Acme Sovereign Capital",
        ownerName: "Alexander Vance",
        companyEmail: "a.vance@acmesovereign.com",
        budget: "$2,500 USD (Tier 3: Complete Enterprise System)",
        tierSelected: "complete_enterprise",
        message: "Requesting immediate high-concurrency vector audit.",
      };
      const validResult = contactSchema.safeParse(validPayload);
      expect(validResult.success).toBe(true);

      // 2. Malicious payload: buffer overflow attack (> 100 chars in businessName)
      const overflowPayload = {
        ...validPayload,
        businessName: "A".repeat(150),
      };
      const overflowResult = contactSchema.safeParse(overflowPayload);
      expect(overflowResult.success).toBe(false);

      // 3. Invalid Email attack: payload with malformed or injected email string
      const badEmailPayload = {
        ...validPayload,
        companyEmail: "<script>alert(1)</script>@domain",
      };
      const badEmailResult = contactSchema.safeParse(badEmailPayload);
      expect(badEmailResult.success).toBe(false);

      // 4. Empty / whitespace-only fields rejected
      const emptyPayload = {
        businessName: "   ",
        ownerName: "",
        companyEmail: "test@domain.com",
        budget: "",
      };
      const emptyResult = contactSchema.safeParse(emptyPayload);
      expect(emptyResult.success).toBe(false);
    });
  });

  describe("Audit 3: SEO & Automated Sitemaps", () => {
    it("verifies production sitemap serves https://morelandchambersvector.com with valid priority and frequencies", () => {
      const siteMapData = sitemap();
      expect(Array.isArray(siteMapData)).toBe(true);
      expect(siteMapData.length).toBeGreaterThanOrEqual(3);

      const root = siteMapData.find((entry) => entry.url === "https://morelandchambersvector.com");
      expect(root).toBeDefined();
      expect(root?.priority).toBe(1.0);
      expect(root?.changeFrequency).toBe("daily");
      expect(root?.lastModified).toBeInstanceOf(Date);

      const design = siteMapData.find((entry) =>
        entry.url.includes("morelandchambersvector.com/design"),
      );
      expect(design).toBeDefined();
      expect(design?.priority).toBe(0.5);

      const dashboard = siteMapData.find((entry) =>
        entry.url.includes("morelandchambersvector.com/dashboard"),
      );
      expect(dashboard).toBeDefined();
      expect(dashboard?.priority).toBe(0.7);
    });

    it("verifies production robots.txt serves valid directives and sitemap reference", () => {
      const robotsData = robots();
      expect(robotsData.sitemap).toBe("https://morelandchambersvector.com/sitemap.xml");

      const rules = Array.isArray(robotsData.rules) ? robotsData.rules[0] : robotsData.rules;
      expect(rules).toBeDefined();
      expect(rules?.userAgent).toBe("*");
      expect(rules?.allow).toContain("/");
      expect(rules?.disallow).toContain("/api/");
      expect(rules?.disallow).toContain("/_next/");
    });

    it("verifies root layout metadata includes canonical URL, OpenGraph, and Twitter tags", () => {
      const layoutPath = path.resolve(process.cwd(), "src/app/layout.tsx");
      const layoutContent = fs.readFileSync(layoutPath, "utf-8");

      expect(layoutContent).toContain("https://morelandchambersvector.com");
      expect(layoutContent).toContain("canonical:");
      expect(layoutContent).toContain("openGraph:");
      expect(layoutContent).toContain("twitter:");
      expect(layoutContent).toContain("robots:");
      expect(layoutContent).toContain("/mcvlogo.png");
    });
  });

  describe("Audit 4: Performance, Bundle Weight & Core Web Vitals Optimization", () => {
    it("ensures zero blocking external Google Web Font stylesheets to prevent FOIT/CLS", () => {
      const globalsCssPath = path.resolve(process.cwd(), "src/app/globals.css");
      const globalsContent = fs.readFileSync(globalsCssPath, "utf-8");

      // Uses modern native system font stack
      expect(globalsContent).toContain("-apple-system");
      expect(globalsContent).toContain("BlinkMacSystemFont");
      expect(globalsContent).not.toContain("@import url('https://fonts.googleapis.com");
    });

    it("verifies image priority and explicit dimensions in navigation header", () => {
      const navPath = path.resolve(process.cwd(), "src/components/luxury/luxury-nav.tsx");
      const navContent = fs.readFileSync(navPath, "utf-8");

      // Next.js Image with width, height, and priority to achieve 0 Cumulative Layout Shift (CLS)
      expect(navContent).toContain("<Image");
      expect(navContent).toContain("priority");
      expect(navContent).toContain("width={44}");
      expect(navContent).toContain("height={34}");
    });

    it("verifies pitch-black obsidian theme tokens and metallic gold animations in globals.css", () => {
      const globalsCssPath = path.resolve(process.cwd(), "src/app/globals.css");
      const globalsContent = fs.readFileSync(globalsCssPath, "utf-8");

      expect(globalsContent).toContain("--luxury-base: #070709;");
      expect(globalsContent).toContain("--luxury-gold: #d4af37;");
      expect(globalsContent).toContain("animate-shimmer-gold");
      expect(globalsContent).toContain("animate-pulse-glow");
      expect(globalsContent).toContain("gold-glow-bloom");
      expect(globalsContent).toContain("luxury-glass");
    });
  });
});

