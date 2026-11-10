import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb, closeDbPool } from "@/db";
import { runSeed } from "@/db/seed";
import { storageService } from "@/modules/storage";
import { ValidationError, NotFoundError } from "@/common/errors";

describe("Secure Storage Service Unit & Integration Tests", () => {
  let orgId: string;
  let userId: string;
  const testDb = getDb();

  beforeAll(async () => {
    const seeded = await runSeed(testDb);
    orgId = seeded.org1.org.id;
    userId = seeded.org1.users[0]!.id;
  });

  afterAll(async () => {
    await closeDbPool();
  });

  describe("createPresignedUploadUrl", () => {
    it("should successfully generate a pre-signed upload URL for allowed MIME types", async () => {
      const res = await storageService.createPresignedUploadUrl(
        {
          organizationId: orgId,
          userId,
          fileName: "architectural_blueprint_v2.pdf",
          mimeType: "application/pdf",
          fileSizeBytes: 1024 * 500, // 500 KB
          category: "blueprint",
          isPrivate: true,
        },
        testDb,
      );

      expect(res.fileId).toBeDefined();
      expect(res.storagePath).toContain(
        `organizations/${orgId}/blueprint/${res.fileId}_architectural_blueprint_v2.pdf`,
      );
      expect(res.uploadUrl).toContain("/api/storage/upload");
      expect(res.uploadUrl).toContain("signature=");
      expect(res.headers["Content-Type"]).toBe("application/pdf");
      expect(res.headers["x-mcv-organization-id"]).toBe(orgId);
    });

    it("should reject disallowed file MIME types with ValidationError", async () => {
      await expect(
        storageService.createPresignedUploadUrl(
          {
            organizationId: orgId,
            userId,
            fileName: "malicious_payload.exe",
            mimeType: "application/x-msdownload",
            fileSizeBytes: 2048,
            category: "general",
          },
          testDb,
        ),
      ).rejects.toThrow(ValidationError);
    });

    it("should reject files exceeding the 50MB size limit with ValidationError", async () => {
      const oversized = 55 * 1024 * 1024; // 55 MB
      await expect(
        storageService.createPresignedUploadUrl(
          {
            organizationId: orgId,
            userId,
            fileName: "large_dataset.zip",
            mimeType: "application/zip",
            fileSizeBytes: oversized,
            category: "general",
          },
          testDb,
        ),
      ).rejects.toThrow(ValidationError);
    });

    it("should reject files with 0 or negative bytes with ValidationError", async () => {
      await expect(
        storageService.createPresignedUploadUrl(
          {
            organizationId: orgId,
            userId,
            fileName: "empty_file.pdf",
            mimeType: "application/pdf",
            fileSizeBytes: 0,
            category: "contract",
          },
          testDb,
        ),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("createPresignedDownloadUrl", () => {
    it("should generate a valid pre-signed download URL for tenant-owned file", async () => {
      // 1. Create upload
      const upload = await storageService.createPresignedUploadUrl(
        {
          organizationId: orgId,
          userId,
          fileName: "compliance_certificate.pdf",
          mimeType: "application/pdf",
          fileSizeBytes: 120000,
          category: "compliance",
        },
        testDb,
      );

      // 2. Request download
      const download = await storageService.createPresignedDownloadUrl(
        {
          organizationId: orgId,
          fileId: upload.fileId,
          userId,
        },
        testDb,
      );

      expect(download.fileId).toBe(upload.fileId);
      expect(download.fileName).toBe("compliance_certificate.pdf");
      expect(download.downloadUrl).toContain("/api/storage/download");
      expect(download.downloadUrl).toContain("signature=");
      expect(download.expiresAt).toBeDefined();
    });

    it("should reject download for non-existent file ID with NotFoundError", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      await expect(
        storageService.createPresignedDownloadUrl(
          {
            organizationId: orgId,
            fileId: fakeId,
            userId,
          },
          testDb,
        ),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("deleteFile (Soft Delete)", () => {
    it("should soft delete a file and prevent subsequent downloads", async () => {
      const upload = await storageService.createPresignedUploadUrl(
        {
          organizationId: orgId,
          userId,
          fileName: "temporary_invoice_draft.pdf",
          mimeType: "application/pdf",
          fileSizeBytes: 50000,
          category: "invoice",
        },
        testDb,
      );

      // Delete file
      await storageService.deleteFile(upload.fileId, orgId, testDb);

      // Verify subsequent download throws NotFoundError
      await expect(
        storageService.createPresignedDownloadUrl(
          {
            organizationId: orgId,
            fileId: upload.fileId,
            userId,
          },
          testDb,
        ),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
