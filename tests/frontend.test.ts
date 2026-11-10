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

  describe("60-30-10 Color Balance Rule in CSS", () => {
    it("defines 60% dominant, 30% structural, and 10% accent variables in globals.css", () => {
      const cssPath = path.resolve(process.cwd(), "src/app/globals.css");
      const cssContent = fs.readFileSync(cssPath, "utf-8");

      expect(cssContent).toContain("--bg-dominant: #090d16");
      expect(cssContent).toContain("--surface-card: #111a2e");
      expect(cssContent).toContain("--accent-primary: #6366f1");
      expect(cssContent).toContain("--accent-emerald: #10b981");
    });
  });
});
