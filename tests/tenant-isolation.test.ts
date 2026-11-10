import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb, closeDbPool } from "@/db";
import { runSeed } from "@/db/seed";
import { tenancyService } from "@/modules/tenancy";
import { salesService } from "@/modules/sales";
import { storageService } from "@/modules/storage";
import { NotFoundError, ForbiddenError } from "@/common/errors";

describe("Multi-Tenant Data Isolation Integration Tests", () => {
  let seededData: Awaited<ReturnType<typeof runSeed>>;
  const testDb = getDb();

  beforeAll(async () => {
    // Seed fresh test database
    seededData = await runSeed(testDb);
  });

  afterAll(async () => {
    await closeDbPool();
  });

  describe("Workspace Isolation", () => {
    it("should allow Organization A to list only its own workspaces", async () => {
      const org1Id = seededData.org1.org.id;
      const workspaces = await tenancyService.listWorkspaces(org1Id, testDb);

      expect(workspaces.length).toBe(2);
      expect(workspaces.every((w) => w.tenantId === org1Id)).toBe(true);
      expect(workspaces.map((w) => w.slug)).toContain("apex-prod");
      expect(workspaces.map((w) => w.slug)).not.toContain("helios-prod");
    });

    it("should allow Organization B to list only its own workspaces", async () => {
      const org2Id = seededData.org2.org.id;
      const workspaces = await tenancyService.listWorkspaces(org2Id, testDb);

      expect(workspaces.length).toBe(2);
      expect(workspaces.every((w) => w.tenantId === org2Id)).toBe(true);
      expect(workspaces.map((w) => w.slug)).toContain("helios-prod");
      expect(workspaces.map((w) => w.slug)).not.toContain("apex-prod");
    });

    it("should reject cross-tenant workspace access with 404 NotFoundError", async () => {
      const org1Id = seededData.org1.org.id;
      const org2Workspaces = await tenancyService.listWorkspaces(seededData.org2.org.id, testDb);
      const foreignWorkspaceId = org2Workspaces[0]?.id;
      expect(foreignWorkspaceId).toBeDefined();

      // Org 1 tries to access Org 2's workspace ID
      await expect(
        tenancyService.getWorkspaceById(org1Id, foreignWorkspaceId!, testDb),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("Sales & Licensing Isolation", () => {
    it("should reject cross-tenant quote access with 404 NotFoundError", async () => {
      const org1Id = seededData.org1.org.id;
      const org2Id = seededData.org2.org.id;

      const org2Quotes = await salesService.listQuotes(org2Id, testDb);
      const foreignQuoteId = org2Quotes[0]?.id;
      expect(foreignQuoteId).toBeDefined();

      // Org 1 tries to access Org 2's quote
      await expect(salesService.getQuoteById(org1Id, foreignQuoteId!, testDb)).rejects.toThrow(
        NotFoundError,
      );
    });

    it("should reject cross-tenant software license access with 404 NotFoundError", async () => {
      const org2Id = seededData.org2.org.id;
      const org1LicenseId = seededData.org1.license!.id;

      // Org 2 tries to access Org 1's license
      await expect(salesService.getLicenseById(org2Id, org1LicenseId, testDb)).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe("Storage & Document Isolation", () => {
    it("should reject cross-tenant file download requests with 404 NotFoundError", async () => {
      const org1Id = seededData.org1.org.id;
      const org2Id = seededData.org2.org.id;

      const org1Files = await storageService.listFiles(org1Id, undefined, testDb);
      const org1FileId = org1Files[0]?.id;
      expect(org1FileId).toBeDefined();

      // Org 2 user attempts to generate download URL for Org 1's file
      await expect(
        storageService.createPresignedDownloadUrl(
          {
            organizationId: org2Id,
            fileId: org1FileId!,
            userId: seededData.org2.users[0]!.id,
          },
          testDb,
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it("should never return foreign organization files in file listing", async () => {
      const org2Id = seededData.org2.org.id;
      const org2Files = await storageService.listFiles(org2Id, undefined, testDb);

      expect(org2Files.length).toBeGreaterThan(0);
      expect(org2Files.every((f) => f.organizationId === org2Id)).toBe(true);
      expect(org2Files.some((f) => f.storagePath.includes("apex-sovereign"))).toBe(false);
    });
  });

  describe("Organization Boundary Enforcement", () => {
    it("should throw ForbiddenError when caller tries to access another organization profile", async () => {
      const org1Id = seededData.org1.org.id;
      const org2Id = seededData.org2.org.id;

      await expect(tenancyService.getTenantById(org1Id, org2Id, testDb)).rejects.toThrow(
        ForbiddenError,
      );
    });
  });
});
