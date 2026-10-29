import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var postgresPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

let pool: Pool | null = null;

if (connectionString) {
  if (process.env.NODE_ENV === "production") {
    pool = new Pool({
      connectionString,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  } else {
    if (!global.postgresPool) {
      global.postgresPool = new Pool({
        connectionString,
        ssl: false,
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 3000,
      });
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
