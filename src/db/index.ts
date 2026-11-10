import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

let poolInstance: pg.Pool | null = null;
let dbInstance: NodePgDatabase<typeof schema> | null = null;

export function getDbPool(): pg.Pool {
  if (!poolInstance) {
    const connectionString =
      process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/mcv_development";

    poolInstance = new Pool({
      connectionString,
      max: process.env.NODE_ENV === "production" ? 20 : 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    poolInstance.on("error", (err) => {
      console.error("Unexpected error on idle PostgreSQL client pool", err);
    });
  }

  return poolInstance;
}

export function getDb(): NodePgDatabase<typeof schema> {
  if (!dbInstance) {
    const pool = getDbPool();
    dbInstance = drizzle(pool, { schema });
  }
  return dbInstance;
}

export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_target, prop) {
    const activeDb = getDb();
    return (activeDb as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export async function closeDbPool(): Promise<void> {
  if (poolInstance) {
    await poolInstance.end();
    poolInstance = null;
    dbInstance = null;
  }
}

export * from "./schema";
