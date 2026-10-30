import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/admin-auth";

const ALLOWED_ENTITIES: Record<string, { table: string; fields: string[] }> = {
  projects: {
    table: "public.projects",
    fields: [
      "slug",
      "title",
      "tagline",
      "description",
      "category",
      "tags",
      "image_url",
      "demo_url",
      "github_url",
      "metrics",
      "featured",
      "order_index",
    ],
  },
  products: {
    table: "public.products",
    fields: [
      "slug",
      "name",
      "headline",
      "description",
      "status",
      "pricing_type",
      "product_url",
      "github_url",
      "badge",
      "icon_name",
      "order_index",
    ],
  },
  news: {
    table: "public.news_articles",
    fields: [
      "slug",
      "title",
      "excerpt",
      "content",
      "category",
      "cover_image",
      "read_time",
      "tags",
      "published",
    ],
  },
  experiences: {
    table: "public.experiences",
    fields: ["period", "company", "brand", "role", "detail", "tags", "url", "order_index"],
  },
  educations: {
    table: "public.educations",
    fields: ["institution", "degree", "period", "detail", "order_index"],
  },
  stacks: {
    table: "public.tech_stacks",
    fields: ["title", "icon_name", "note", "tags", "grid_span", "order_index"],
  },
  impact: {
    table: "public.impact_metrics",
    fields: ["metric", "title", "detail", "order_index"],
  },
  prompts: {
    table: "public.prompt_showcases",
    fields: [
      "slug",
      "title",
      "type",
      "description",
      "prompt_text",
      "tags",
      "target_model",
      "badge",
      "instructions",
      "order_index",
    ],
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: { entity: string } }
) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entityConfig = ALLOWED_ENTITIES[params.entity];
  if (!entityConfig) {
    return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
  }

  if (!pool) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 });
  }

  try {
    const res = await pool.query(
      `SELECT * FROM ${entityConfig.table} ORDER BY order_index ASC, created_at DESC`
    );
    return NextResponse.json(res.rows);
  } catch (err: any) {
    // If order_index or created_at doesn't exist on this table, fallback to simple select
    try {
      const res = await pool.query(`SELECT * FROM ${entityConfig.table}`);
      return NextResponse.json(res.rows);
    } catch (err2: any) {
      return NextResponse.json({ error: err2.message }, { status: 500 });
    }
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { entity: string } }
) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entityConfig = ALLOWED_ENTITIES[params.entity];
  if (!entityConfig) {
    return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
  }

  if (!pool) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 });
  }

  try {
    const body = await req.json();

    const insertCols: string[] = [];
    const insertVals: any[] = [];
    const placeholders: string[] = [];

    entityConfig.fields.forEach((field) => {
      if (body[field] !== undefined) {
        insertCols.push(field);
        insertVals.push(body[field]);
        placeholders.push(`$${insertVals.length}`);
      }
    });

    if (insertCols.length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const query = `
      INSERT INTO ${entityConfig.table} (${insertCols.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING *
    `;

    const res = await pool.query(query, insertVals);
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
