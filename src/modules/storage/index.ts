/**
 * Storage Module — Public Facade Interface
 */

export * from "./types";
export * from "./storage-service";

export const storageModule = {
  name: "storage",
  description:
    "Secure multi-tenant file storage, pre-signed upload/download services, and MIME validation",
} as const;
