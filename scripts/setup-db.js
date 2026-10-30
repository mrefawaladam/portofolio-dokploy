/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

// Simple loader for .env.local or .env
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const idx = trimmed.indexOf("=");
          if (idx !== -1) {
            const key = trimmed.slice(0, idx).trim();
            const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
      console.log(`Loaded environment from ${file}`);
      break;
    }
  }
}

loadEnv();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ ERROR: DATABASE_URL is not set in environment or .env.local!");
  console.log("Example: DATABASE_URL=postgresql://postgres:postgres@localhost:5432/refa_portfolio");
  process.exit(1);
}

const isSSL =
  process.env.DATABASE_SSL === "true" ||
  connectionString.includes("sslmode=require") ||
  connectionString.includes("neon.tech") ||
  connectionString.includes("supabase.co");

const client = new Client({
  connectionString,
  ssl: isSSL ? { rejectUnauthorized: false } : false,
});

async function run() {
  const isCheckOnly = process.argv.includes("--check");

  try {
    console.log("🔌 Connecting to PostgreSQL database...");
    await client.connect();
    console.log(" Connected to PostgreSQL successfully!");

    if (isCheckOnly) {
      console.log("\n📊 Checking tables in database:");
      const tables = [
        "projects",
        "products",
        "news_articles",
        "experiences",
        "educations",
        "tech_stacks",
        "impact_metrics",
      ];
      for (const t of tables) {
        try {
          const res = await client.query(`SELECT count(*) as total FROM public.${t}`);
          console.log(`  - public.${t.padEnd(16)} : ${res.rows[0].total} rows`);
        } catch (e) {
          console.log(`  - public.${t.padEnd(16)} : [TABLE NOT FOUND / ERROR]`);
        }
      }
      return;
    }

    console.log("\n📜 Executing scripts/schema.sql (Creating tables & seeds)...");
    const sqlPath = path.resolve(__dirname, "schema.sql");
    const sqlContent = fs.readFileSync(sqlPath, "utf-8");

    await client.query(sqlContent);
    console.log(" All tables and seeds created successfully!");

    console.log("\n Verification:");
    const tables = [
      "projects",
      "products",
      "news_articles",
      "experiences",
      "educations",
      "tech_stacks",
      "impact_metrics",
    ];
    for (const t of tables) {
      const res = await client.query(`SELECT count(*) as total FROM public.${t}`);
      console.log(`  - public.${t.padEnd(16)} : ${res.rows[0].total} records`);
    }

    console.log("\n Database initialization complete for refa-portfolio!");
  } catch (err) {
    console.error("❌ Database operation failed:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
