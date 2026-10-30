"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Newspaper,
  Calendar,
  Clock,
  Tag,
  ArrowUpRight,
  Filter,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { NewsArticle } from "@/types/portfolio";

interface NewsPageClientProps {
  initialNews: NewsArticle[];
}

export default function NewsPageClient({ initialNews }: NewsPageClientProps) {
  const [articles] = useState<NewsArticle[]>(initialNews);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");

  // Extract categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return ["All", ...Array.from(set)];
  }, [articles]);

  // Extract tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      a.tags?.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [articles]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchCategory =
        selectedCategory === "All" ||
        a.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchTag =
        selectedTag === "All" ||
        a.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query) ||
        (a.content && a.content.toLowerCase().includes(query)) ||
        a.tags?.some((t) => t.toLowerCase().includes(query));

      return matchCategory && matchTag && matchSearch;
    });
  }, [articles, selectedCategory, selectedTag, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* STICKY TOP NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 hover:text-blue-700"
            >
              <ArrowLeft size={14} /> Back to Portfolio
            </Link>

            <span className="hidden sm:inline-block h-4 w-px bg-slate-200" />

            <nav className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Link href="/prompts" className="px-2.5 py-1 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition">
                Prompt Showcase
              </Link>
              <Link href="/#projects" className="px-2.5 py-1 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition">
                Projects
              </Link>
              <Link href="/#products" className="px-2.5 py-1 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition">
                Products
              </Link>
            </nav>
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

      {/* MAIN CONTAINER */}
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 flex-1">
        {/* HERO BANNER */}
        <section className="mb-12 rounded-3xl border border-blue-100 bg-gradient-to-br from-[#0b1535] via-[#10245e] to-[#0e7490] p-8 md:p-14 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 px-3.5 py-1 text-xs font-bold text-cyan-300 mb-6">
              <Newspaper size={14} /> Engineering Updates &amp; Devlog
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.08]">
              Technical Insights, Postmortems <br />
              <span className="bg-gradient-to-r from-blue-200 via-sky-200 to-cyan-300 bg-clip-text text-transparent">
                &amp; Architecture Case Studies.
              </span>
            </h1>
            <p className="mt-5 text-sm md:text-base leading-relaxed text-slate-200 max-w-2xl">
              Catatan teknis seputar migrasi legacy monolith ke Next.js &amp; Golang DDD, implementasi RabbitMQ di skala enterprise, optimasi query database, dan riset performa server-side.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="rounded-xl bg-white/10 px-3 py-1.5 backdrop-blur-sm border border-white/10 text-cyan-200">
                📰 {articles.length} Published Articles
              </span>
              <span className="rounded-xl bg-white/10 px-3 py-1.5 backdrop-blur-sm border border-white/10 text-slate-200">
                🔍 In-depth Benchmarks &amp; Code Snippets
              </span>
            </div>
          </div>

          <div className="absolute right-0 top-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute right-40 bottom-0 -mb-20 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
        </section>

        {/* SEARCH & FILTERS TOOLBAR */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles by title, topic, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 shadow-xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{filteredArticles.length}</span> of {articles.length} articles
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mr-1">
              <Filter size={13} className="text-blue-600" /> Category:
            </span>
            {categories.map((c) => {
              const isActive = selectedCategory.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 scale-[1.02]"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Tag Cloud */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setSelectedTag("All")}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                  selectedTag === "All"
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Tags
              </button>
              {allTags.map((tag) => {
                const isActive = selectedTag.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(isActive ? "All" : tag)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}

              {(selectedCategory !== "All" || selectedTag !== "All" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedTag("All");
                    setSearchQuery("");
                  }}
                  className="ml-2 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition"
                  title="Reset all filters"
                >
                  <RotateCcw size={11} /> Reset All
                </button>
              )}
            </div>
          )}
        </div>

        {/* ARTICLES GRID */}
        {filteredArticles.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
              <Newspaper size={26} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No articles found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Tidak ada artikel yang cocok dengan filter atau kata kunci pencarian Anda.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedTag("All");
                setSearchQuery("");
              }}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <RotateCcw size={13} /> Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((item) => {
              const pubVal: any = item.published_at;
              const formattedDate = pubVal
                ? pubVal instanceof Date
                  ? pubVal.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()
                  : String(pubVal).includes("-") && !isNaN(Date.parse(String(pubVal)))
                  ? new Date(String(pubVal)).toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()
                  : String(pubVal)
                : "OCT 2026";

              return (
                <motion.article
                  key={item.id || item.slug}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
                >
                  <div>
                    {/* Cover image or Header block */}
                    {item.cover_image ? (
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.cover_image}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-28 w-full bg-gradient-to-br from-blue-700 via-indigo-700 to-cyan-700 p-4 flex items-start justify-between">
                        <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-white/60 text-[11px] font-mono">{item.read_time}</span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400 mb-2.5">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {formattedDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {item.read_time}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition leading-snug">
                        <Link href={`/news/${item.slug}`}>
                          {item.title}
                        </Link>
                      </h3>

                      <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                        {item.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <div className="mb-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-4">
                      {item.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/news/${item.slug}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-200 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-blue-600 hover:border-blue-600 hover:text-white group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white"
                    >
                      Read Full Article <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Muhammad Refa Walada Mushtofa. All rights reserved.</p>
          <div className="flex items-center gap-4 font-semibold text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <Link href="/prompts" className="hover:text-blue-600 transition">Prompt Showcase</Link>
            <Link href="/#contact" className="hover:text-blue-600 transition">Contact</Link>
            <Link href="/admin" className="hover:text-blue-600 transition">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
