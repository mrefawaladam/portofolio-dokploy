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
  courses: {
    table: "public.tutorial_courses",
    fields: [
      "slug",
      "title",
      "tagline",
      "description",
      "category",
      "level",
      "badge",
      "icon",
      "order_index",
      "published",
    ],
  },
  modules: {
    table: "public.tutorial_modules",
    fields: ["course_id", "slug", "title", "order_index"],
  },
  lessons: {
    table: "public.tutorial_lessons",
    fields: [
      "course_id",
      "module_id",
      "slug",
      "title",
      "order_index",
      "duration",
      "type",
      "excerpt",
      "tags",
      "content",
      "published",
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

    // Auto-seed default lessons from Markdown content if DB has 0 lessons
    if (params.entity === "lessons" && res.rows.length === 0) {
      try {
        const courseCheck = await pool.query(
          "SELECT id FROM public.tutorial_courses WHERE slug = 'event-driven-rabbitmq' LIMIT 1"
        );
        if (courseCheck.rows.length > 0) {
          const courseId = courseCheck.rows[0].id;
          const modsRes = await pool.query(
            "SELECT id, slug FROM public.tutorial_modules WHERE course_id = $1 ORDER BY order_index ASC",
            [courseId]
          );
          if (modsRes.rows.length > 0) {
            const fs = await import("fs");
            const path = await import("path");
            const matter = (await import("gray-matter")).default;
            const baseDir = path.join(process.cwd(), "content", "tutorials", "event-driven-rabbitmq");
            if (fs.existsSync(baseDir)) {
              for (const mod of modsRes.rows) {
                const modDir = path.join(baseDir, mod.slug);
                if (fs.existsSync(modDir)) {
                  const files = fs.readdirSync(modDir).filter((f) => f.endsWith(".md")).sort();
                  for (let fIdx = 0; fIdx < files.length; fIdx++) {
                    const f = files[fIdx];
                    const contentRaw = fs.readFileSync(path.join(modDir, f), "utf-8");
                    const parsed = matter(contentRaw);
                    const slug = f.replace(/^\d+[-_]/, "").replace(/\.md$/, "");
                    await pool.query(
                      `INSERT INTO public.tutorial_lessons (course_id, module_id, slug, title, order_index, duration, type, excerpt, tags, content, published)
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
                       ON CONFLICT (course_id, slug) DO NOTHING`,
                      [
                        courseId,
                        mod.id,
                        slug,
                        parsed.data.title || slug,
                        fIdx + 1,
                        parsed.data.duration || "10 min read",
                        parsed.data.type || "reading",
                        parsed.data.excerpt || "",
                        parsed.data.tags || [],
                        parsed.content.trim(),
                      ]
                    );
                  }
                }
              }
              const reloaded = await pool.query(
                `SELECT * FROM public.tutorial_lessons ORDER BY order_index ASC, created_at DESC`
              );
              return NextResponse.json(reloaded.rows);
            }
          }
        }
      } catch (seedErr) {
        console.error("Auto-seed error for lessons:", seedErr);
      }
    }

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
