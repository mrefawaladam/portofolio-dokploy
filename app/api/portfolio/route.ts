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
      const [
        projectsRes,
        productsRes,
        newsRes,
        experiencesRes,
        educationsRes,
        stacksRes,
        impactRes,
      ] = await Promise.all([
        client.query("SELECT * FROM public.projects ORDER BY order_index ASC, created_at DESC"),
        client.query("SELECT * FROM public.products ORDER BY order_index ASC, created_at DESC"),
        client.query("SELECT * FROM public.news_articles WHERE published = true ORDER BY published_at DESC LIMIT 6"),
        client.query("SELECT * FROM public.experiences ORDER BY order_index ASC, created_at DESC"),
        client.query("SELECT * FROM public.educations ORDER BY order_index ASC, created_at DESC"),
        client.query("SELECT * FROM public.tech_stacks ORDER BY order_index ASC"),
        client.query("SELECT * FROM public.impact_metrics ORDER BY order_index ASC"),
      ]);

      return NextResponse.json({
        projects: projectsRes.rows.length > 0 ? projectsRes.rows : fallbackPortfolioData.projects,
        products: productsRes.rows.length > 0 ? productsRes.rows : fallbackPortfolioData.products,
        news: newsRes.rows.length > 0 ? newsRes.rows : fallbackPortfolioData.news,
        experiences: experiencesRes.rows.length > 0 ? experiencesRes.rows : fallbackPortfolioData.experiences,
        educations: educationsRes.rows.length > 0 ? educationsRes.rows : fallbackPortfolioData.educations,
        stacks: stacksRes.rows.length > 0 ? stacksRes.rows : fallbackPortfolioData.stacks,
        impact: impactRes.rows.length > 0 ? impactRes.rows : fallbackPortfolioData.impact,
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.warn("PostgreSQL connection error, falling back to local dataset:", err.message);
    return NextResponse.json(fallbackPortfolioData);
  }
}
