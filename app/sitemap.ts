import { MetadataRoute } from "next";
import pool from "@/lib/db";
import { fallbackNews } from "@/data/fallback-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mrefawm.my.id";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tutorials`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/prompts`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  let slugs = fallbackNews.map((n) => n.slug);

  if (pool) {
    try {
      const res = await pool.query(
        "SELECT slug FROM public.news_articles WHERE published = true"
      );
      if (res.rows.length > 0) {
        slugs = Array.from(new Set([...slugs, ...res.rows.map((r: { slug: string }) => r.slug)]));
      }
    } catch {
      // Keep fallback slugs
    }
  }

  const articleRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${baseUrl}/news/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...articleRoutes];
}

