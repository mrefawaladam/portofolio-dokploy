import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { fallbackPortfolioData } from "@/data/fallback-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!pool) {
      return NextResponse.json(fallbackPortfolioData);
    }

    const client = await pool.connect();
    try {
      const [projectsRes, productsRes, newsRes] = await Promise.all([
        client.query("SELECT * FROM public.projects ORDER BY order_index ASC, created_at DESC"),
        client.query("SELECT * FROM public.products ORDER BY order_index ASC, created_at DESC"),
        client.query("SELECT * FROM public.news_articles WHERE published = true ORDER BY published_at DESC LIMIT 6"),
      ]);

      const projects = projectsRes.rows.length > 0 ? projectsRes.rows : fallbackPortfolioData.projects;
      const products = productsRes.rows.length > 0 ? productsRes.rows : fallbackPortfolioData.products;
      const news = newsRes.rows.length > 0 ? newsRes.rows : fallbackPortfolioData.news;

      return NextResponse.json({
        projects,
        products,
        news,
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.warn("PostgreSQL connection error, falling back to local dataset:", err.message);
    return NextResponse.json(fallbackPortfolioData);
  }
}
