import { Metadata } from "next";
import pool from "@/lib/db";
import { fallbackNews } from "@/data/fallback-data";
import { NewsArticle } from "@/types/portfolio";
import NewsPageClient from "@/components/NewsPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Engineering News & Devlog | Muhammad Refa Walada Mushtofa",
  description:
    "Technical insights, legacy modernization case studies, RabbitMQ event-driven workflows, and backend performance postmortems by Muhammad Refa Walada Mushtofa.",
  openGraph: {
    title: "Engineering News & Devlog | Muhammad Refa Walada Mushtofa",
    description:
      "Technical insights, legacy modernization case studies, and backend architecture postmortems.",
    type: "website",
    url: "https://mrefawm.my.id/news",
  },
};

async function getAllNews(): Promise<NewsArticle[]> {
  if (pool) {
    try {
      const res = await pool.query(
        "SELECT * FROM public.news_articles WHERE published = true ORDER BY published_at DESC"
      );
      if (res.rows.length > 0) {
        return res.rows;
      }
    } catch (err) {
      console.error("Error fetching all news articles:", err);
    }
  }
  return fallbackNews;
}

export default async function NewsPage() {
  const articles = await getAllNews();

  return <NewsPageClient initialNews={articles} />;
}
