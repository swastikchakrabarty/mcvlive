import crypto from "node:crypto";
import { eq, and, isNull } from "drizzle-orm";
import { getDb, storageFiles } from "@/db";
import { ValidationError, NotFoundError } from "@/common/errors";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  type CreateUploadUrlRequest,
  type CreateUploadUrlResponse,
  type GetDownloadUrlRequest,
  type GetDownloadUrlResponse,
  type StoredFileRecord,
  type FileCategory,
} from "./types";

export class SecureStorageService {
  private readonly signingSecret: string;
  private readonly cdnBaseUrl: string;

  constructor(
    signingSecret = process.env.STORAGE_SIGNING_SECRET ||
      "mcv_default_secure_storage_hmac_secret_key_2026",
    cdnBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ) {
    this.signingSecret = signingSecret;
    this.cdnBaseUrl = cdnBaseUrl.replace(/\/+$/, "");
  }

  /**
   * Sanitize filename to prevent directory traversal or malformed paths
   */
  private sanitizeFileName(fileName: string): string {
    const baseName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    if (!baseName || baseName === "." || baseName === "..") {
      return `file_${Date.now()}`;
    }
    return baseName;
  }

  /**
   * Generates a pre-signed upload URL for direct client-to-storage uploads.
   * Validates MIME type, file size bounds, and scopes storage path strictly by organization_id.
   */
  async createPresignedUploadUrl(
    request: CreateUploadUrlRequest,
    customDb = getDb(),
  ): Promise<CreateUploadUrlResponse> {
    const {
      organizationId,
      userId,
      fileName,
      mimeType,
      fileSizeBytes,
      category,
      isPrivate = true,
    } = request;

    // 1. Validate Organization ID presence
    if (!organizationId) {
      throw new ValidationError("organizationId is strictly required for storage path scoping");
    }

    // 2. Validate MIME Type against whitelist
    if (!ALLOWED_MIME_TYPES.includes(mimeType as (typeof ALLOWED_MIME_TYPES)[number])) {
      throw new ValidationError(
        `MIME type '${mimeType}' is not permitted. Allowed formats: ${ALLOWED_MIME_TYPES.join(", ")}`,
      );
    }

    // 3. Validate File Size Boundaries
    if (!fileSizeBytes || fileSizeBytes <= 0) {
      throw new ValidationError("File size must be greater than 0 bytes");
    }
    if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
      throw new ValidationError(
        `File size (${fileSizeBytes} bytes) exceeds maximum allowable limit of ${MAX_FILE_SIZE_BYTES} bytes (50MB)`,
      );
    }

    // 4. Validate Category
    const validCategories: FileCategory[] = [
      "contract",
      "invoice",
      "blueprint",
      "compliance",
      "general",
    ];
    if (!validCategories.includes(category)) {
      throw new ValidationError(`Invalid file category '${category}'`);
    }

    const fileId = crypto.randomUUID();
    const sanitizedName = this.sanitizeFileName(fileName);

    // 5. Build strict organization-scoped path
    const storagePath = `organizations/${organizationId}/${category}/${fileId}_${sanitizedName}`;

    // 6. Generate Pre-signed Upload URL with HMAC token
    const expiresInSeconds = 900; // 15 minutes TTL
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const token = crypto
      .createHmac("sha256", this.signingSecret)
      .update(`upload:${storagePath}:${expiresAt}`)
      .digest("hex");

    const uploadUrl = `${this.cdnBaseUrl}/api/storage/upload?path=${encodeURIComponent(
      storagePath,
    )}&expires=${expiresAt}&signature=${token}`;

    // 7. Persist metadata record in database
    await customDb.insert(storageFiles).values({
      id: fileId,
      organization_id: organizationId,
      uploaded_by: userId || null,
      file_name: fileName,
      storage_path: storagePath,
      file_size_bytes: fileSizeBytes,
      mime_type: mimeType,
      category,
      is_private: isPrivate,
    });

    return {
      fileId,
      storagePath,
      uploadUrl,
      expiresInSeconds,
      headers: {
        "Content-Type": mimeType,
        "x-mcv-organization-id": organizationId,
      },
    };
  }

  /**
   * Generates a secure, time-limited download URL.
   * Enforces strict organization isolation: user cannot access files belonging to another organization.
   */
  async createPresignedDownloadUrl(
    request: GetDownloadUrlRequest,
    customDb = getDb(),
  ): Promise<GetDownloadUrlResponse> {
    const { organizationId, fileId, expiresInSeconds = 900 } = request;

    if (!organizationId) {
      throw new ValidationError("organizationId is required for tenant access verification");
    }

    // 1. Query file by ID and ensure it is not soft-deleted
    const [file] = await customDb
      .select()
      .from(storageFiles)
      .where(and(eq(storageFiles.id, fileId), isNull(storageFiles.deleted_at)))
      .limit(1);

    // 2. Return 404 if file does not exist OR belongs to another tenant (zero information disclosure)
    if (!file || file.organization_id !== organizationId) {
      throw new NotFoundError("Document or file", fileId);
    }

    // 3. Generate HMAC signed download token
    const expiresAtUnix = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const signature = crypto
      .createHmac("sha256", this.signingSecret)
      .update(`download:${file.storage_path}:${expiresAtUnix}`)
      .digest("hex");

    const downloadUrl = `${this.cdnBaseUrl}/api/storage/download?path=${encodeURIComponent(
      file.storage_path,
    )}&expires=${expiresAtUnix}&signature=${signature}`;

    return {
      fileId: file.id,
      fileName: file.file_name,
      downloadUrl,
      mimeType: file.mime_type,
      fileSizeBytes: file.file_size_bytes,
      expiresAt: new Date(expiresAtUnix * 1000).toISOString(),
    };
  }

  /**
   * Fetch all files belonging to an organization with optional category filter
   */
  async listFiles(
    organizationId: string,
    category?: FileCategory,
    customDb = getDb(),
  ): Promise<StoredFileRecord[]> {
    if (!organizationId) {
      throw new ValidationError("organizationId is required");
    }

    const conditions = [
      eq(storageFiles.organization_id, organizationId),
      isNull(storageFiles.deleted_at),
    ];

    if (category) {
      conditions.push(eq(storageFiles.category, category));
    }

    const records = await customDb
      .select()
      .from(storageFiles)
      .where(and(...conditions));

    return records.map((r) => ({
      id: r.id,
      organizationId: r.organization_id,
      uploadedBy: r.uploaded_by,
      fileName: r.file_name,
      storagePath: r.storage_path,
      fileSizeBytes: r.file_size_bytes,
      mimeType: r.mime_type,
      category: r.category,
      isPrivate: r.is_private,
      checksumSha256: r.checksum_sha256,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  /**
   * Soft-delete file record, ensuring tenant ownership
   */
  async deleteFile(fileId: string, organizationId: string, customDb = getDb()): Promise<void> {
    const [file] = await customDb
      .select()
      .from(storageFiles)
      .where(and(eq(storageFiles.id, fileId), isNull(storageFiles.deleted_at)))
      .limit(1);

    if (!file || file.organization_id !== organizationId) {
      throw new NotFoundError("File", fileId);
    }

    await customDb
      .update(storageFiles)
      .set({ deleted_at: new Date(), updated_at: new Date() })
      .where(eq(storageFiles.id, fileId));
  }
}

export const storageService = new SecureStorageService();
