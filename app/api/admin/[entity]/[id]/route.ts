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

export async function PUT(
  req: NextRequest,
  { params }: { params: { entity: string; id: string } }
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

    const updates: string[] = [];
    const values: any[] = [];

    entityConfig.fields.forEach((field) => {
      if (body[field] !== undefined) {
        values.push(body[field]);
        updates.push(`${field} = $${values.length}`);
      }
    });

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(params.id);
    const idPlaceholder = `$${values.length}`;

    const query = `
      UPDATE ${entityConfig.table}
      SET ${updates.join(", ")}
      WHERE id = ${idPlaceholder}
      RETURNING *
    `;

    const res = await pool.query(query, values);
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { entity: string; id: string } }
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
    const query = `DELETE FROM ${entityConfig.table} WHERE id = $1 RETURNING id`;
    const res = await pool.query(query, [params.id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: params.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
