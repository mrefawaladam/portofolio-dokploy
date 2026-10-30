import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Tag, Shield, ArrowUpRight } from "lucide-react";
import pool from "@/lib/db";
import { fallbackNews } from "@/data/fallback-data";
import { NewsArticle } from "@/types/portfolio";
import MarkdownViewer from "@/components/MarkdownViewer";

export const dynamic = "force-dynamic";

async function getArticle(slug: string): Promise<NewsArticle | null> {
  if (pool) {
    try {
      const res = await pool.query(
        "SELECT * FROM public.news_articles WHERE slug = $1 AND published = true LIMIT 1",
        [slug]
      );
      if (res.rows.length > 0) {
        return res.rows[0];
      }
    } catch (err) {
      console.error("Error fetching article by slug:", err);
    }
  }

  const fallback = fallbackNews.find((n) => n.slug === slug);
  return fallback || null;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) {
    return { title: "Article Not Found | Refa's Portfolio" };
  }

  return {
    title: `${article.title} | Refa Walada Mushtofa`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.cover_image ? [article.cover_image] : undefined,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const pubVal: any = article.published_at;
  const formattedDate = pubVal
    ? pubVal instanceof Date
      ? pubVal.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()
      : String(pubVal).includes("-") && !isNaN(Date.parse(String(pubVal)))
      ? new Date(String(pubVal)).toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()
      : String(pubVal)
    : "OCT 2026";

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 hover:text-blue-700"
            >
              <ArrowLeft size={14} /> Back to News
            </Link>
            <Link
              href="/"
              className="text-xs font-medium text-slate-500 hover:text-slate-800 transition"
            >
              Home
            </Link>
          </div>

          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-dark.png"
              alt="mrefawm"
              width={110}
              height={36}
              className="h-6 w-auto object-contain"
            />
          </Link>
        </div>
      </header>

      {/* Main Content Article */}
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8 flex-1">
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          {/* Metadata bar */}
          <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-slate-100 pb-5 text-xs text-slate-500">
            <span className="rounded-full bg-blue-50 px-3 py-1 font-bold text-blue-700">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={13} className="text-slate-400" /> {article.read_time}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar size={13} className="text-slate-400" /> {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-base text-slate-500 leading-relaxed font-medium mb-8 pb-6 border-b border-slate-100">
            {article.excerpt}
          </p>

          {/* Cover Image */}
          {article.cover_image && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.cover_image}
                alt={article.title}
                className="max-h-[460px] w-full object-cover"
              />
            </div>
          )}

          {/* Article Body Markdown */}
          <div className="py-2">
            <MarkdownViewer content={article.content || article.excerpt} />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
                <Tag size={13} /> Tags:
              </span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-4xl flex-col sm:flex-row items-center justify-between gap-4 px-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Muhammad Refa Walada Mushtofa · All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/admin" className="hover:text-blue-600 transition">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
