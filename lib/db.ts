import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var postgresPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

let pool: Pool | null = null;

if (connectionString) {
  const isSSL =
    process.env.DATABASE_SSL === "true" ||
    connectionString.includes("sslmode=require") ||
    connectionString.includes("neon.tech") ||
    connectionString.includes("supabase.co");

  const poolConfig = {
    connectionString,
    ssl: isSSL ? { rejectUnauthorized: false } : false,
    max: process.env.NODE_ENV === "production" ? 10 : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };

  if (process.env.NODE_ENV === "production") {
    pool = new Pool(poolConfig);
  } else {
    if (!global.postgresPool) {
      global.postgresPool = new Pool(poolConfig);
    }
    pool = global.postgresPool;
  }
}

export default pool;

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  if (!pool) {
    throw new Error("DATABASE_URL not configured");
  }
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
}

export async function safeQuery<T = any>(text: string, params: any[] = []): Promise<T[] | null> {
  if (!pool) return null;
  try {
    const client = await pool.connect();
    try {
      const res = await client.query(text, params);
      return res.rows;
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.warn("Database query warning (falling back):", err.message);
    return null;
  }
}
