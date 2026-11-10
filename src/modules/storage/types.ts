/**
 * Storage Domain Contracts & Types
 */

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/json",
  "application/zip",
  "text/plain",
  "text/csv",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 Megabytes

export type FileCategory = "contract" | "invoice" | "blueprint" | "compliance" | "general";

export interface CreateUploadUrlRequest {
  organizationId: string;
  userId: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  category: FileCategory;
  isPrivate?: boolean;
}

export interface CreateUploadUrlResponse {
  fileId: string;
  storagePath: string;
  uploadUrl: string;
  expiresInSeconds: number;
  headers: Record<string, string>;
}

export interface GetDownloadUrlRequest {
  organizationId: string;
  fileId: string;
  userId: string;
  expiresInSeconds?: number;
}

export interface GetDownloadUrlResponse {
  fileId: string;
  fileName: string;
  downloadUrl: string;
  mimeType: string;
  fileSizeBytes: number;
  expiresAt: string;
}

export interface StoredFileRecord {
  id: string;
  organizationId: string;
  uploadedBy: string | null;
  fileName: string;
  storagePath: string;
  fileSizeBytes: number;
  mimeType: string;
  category: string;
  isPrivate: boolean;
  checksumSha256: string | null;
  createdAt: Date;
  updatedAt: Date;
}
