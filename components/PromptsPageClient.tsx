"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Sparkles,
  Layers,
  Bot,
  Copy,
  Check,
  Maximize2,
  X,
  BookOpen,
  Filter,
  RotateCcw,
  LayoutGrid,
  SlidersHorizontal,
  Terminal,
  Cpu,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { PromptShowcase } from "@/types/portfolio";
import PromptShowcaseCarousel from "@/components/PromptShowcaseCarousel";

interface PromptsPageClientProps {
  initialPrompts: PromptShowcase[];
}

export default function PromptsPageClient({ initialPrompts }: PromptsPageClientProps) {
  const [prompts] = useState<PromptShowcase[]>(initialPrompts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalPrompt, setModalPrompt] = useState<PromptShowcase | null>(null);
  const [isModalCopied, setIsModalCopied] = useState(false);

  // Extract all unique types
  const types = useMemo(() => {
    const set = new Set<string>();
    prompts.forEach((p) => {
      if (p.type) set.add(p.type);
    });
    return ["All", ...Array.from(set)];
  }, [prompts]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    prompts.forEach((p) => {
      p.tags?.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [prompts]);

  // Filter prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      const matchType = selectedType === "All" || p.type === selectedType;
      const matchTag =
        selectedTag === "All" ||
        p.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.prompt_text.toLowerCase().includes(query) ||
        p.target_model?.toLowerCase().includes(query) ||
        p.tags?.some((t) => t.toLowerCase().includes(query));

      return matchType && matchTag && matchSearch;
    });
  }, [prompts, selectedType, selectedTag, searchQuery]);

  const handleCopyPrompt = async (prompt: PromptShowcase, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.prompt_text);
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = prompt.prompt_text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleModalCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsModalCopied(true);
      setTimeout(() => setIsModalCopied(false), 2000);
    } catch {
      setIsModalCopied(true);
      setTimeout(() => setIsModalCopied(false), 2000);
    }
  };

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
              <Link href="/news" className="px-2.5 py-1 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition">
                News & Devlog
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
              <Sparkles size={14} /> AI &amp; Prompt Engineering Catalog
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.08]">
              High-Precision System Prompts <br />
              <span className="bg-gradient-to-r from-blue-200 via-sky-200 to-cyan-300 bg-clip-text text-transparent">
                for Software Architects &amp; Engineers.
              </span>
            </h1>
            <p className="mt-5 text-sm md:text-base leading-relaxed text-slate-200 max-w-2xl">
              Koleksi prompt teruji untuk perancangan arsitektur Hexagonal &amp; DDD di Golang, event-driven message queuing (RabbitMQ), optimasi indeks PostgreSQL, review kode keamanan, serta autonomous AI coding agents.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="rounded-xl bg-white/10 px-3 py-1.5 backdrop-blur-sm border border-white/10 text-cyan-200">
                ⚡ {prompts.length} Verified Prompts
              </span>
              <span className="rounded-xl bg-white/10 px-3 py-1.5 backdrop-blur-sm border border-white/10 text-slate-200">
                🎯 Claude 3.5 Sonnet · GPT-4o · DeepSeek
              </span>
              <span className="rounded-xl bg-white/10 px-3 py-1.5 backdrop-blur-sm border border-white/10 text-slate-200">
                📋 1-Click Copy &amp; Markdown Ready
              </span>
            </div>
          </div>

          {/* Decorative glowing gradient orbs */}
          <div className="absolute right-0 top-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute right-40 bottom-0 -mb-20 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
        </section>

        {/* SEARCH & CONTROLS TOOLBAR */}
        <div className="mb-8 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search prompts by keyword, model, or language..."
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

            {/* View Switcher: Carousel vs Grid */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">View:</span>
              <button
                onClick={() => setViewMode("carousel")}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  viewMode === "carousel"
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <SlidersHorizontal size={14} /> Carousel
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <LayoutGrid size={14} /> Grid ({filteredPrompts.length})
              </button>
            </div>
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mr-1">
              <Filter size={13} className="text-blue-600" /> Type:
            </span>
            {types.map((t) => {
              const isActive = selectedType === t;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 scale-[1.02]"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {t}
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

              {(selectedType !== "All" || selectedTag !== "All" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedType("All");
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

        {/* PROMPTS DISPLAY */}
        {filteredPrompts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
              <Sparkles size={26} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No prompts found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Tidak ada prompt yang cocok dengan filter atau kata kunci pencarian Anda.
            </p>
            <button
              onClick={() => {
                setSelectedType("All");
                setSelectedTag("All");
                setSearchQuery("");
              }}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <RotateCcw size={13} /> Reset Filter
            </button>
          </div>
        ) : viewMode === "carousel" ? (
          /* CAROUSEL VIEW */
          <div className="rounded-3xl bg-slate-100/50 p-2 md:p-6 border border-slate-200">
            <PromptShowcaseCarousel prompts={filteredPrompts} />
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((p) => (
              <motion.article
                key={p.id || p.slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-400 hover:shadow-md transition-all duration-300"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 border border-blue-100">
                      {p.type}
                    </span>
                    {p.badge && (
                      <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-700 transition leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
                    {p.description}
                  </p>

                  {/* Code box preview */}
                  <div className="mt-4 rounded-xl border border-slate-800 bg-[#0b1020] p-3 text-[11px] font-mono text-slate-300 relative group/code overflow-hidden">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[9px] text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Terminal size={10} className="text-cyan-400" />
                        {p.slug || "prompt"}.md
                      </span>
                      <span>{p.target_model || "LLM"}</span>
                    </div>
                    <pre className="line-clamp-4 whitespace-pre-wrap text-slate-300 text-[10px] leading-relaxed">
                      {p.prompt_text}
                    </pre>
                  </div>
                </div>

                {/* Footer action bar */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {p.tags?.slice(0, 3).map((t) => (
                      <span key={t} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                        #{t}
                      </span>
                    ))}
                    {p.tags && p.tags.length > 3 && (
                      <span className="text-[10px] text-slate-400">+{p.tags.length - 3}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => handleCopyPrompt(p, e)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                        copiedId === p.id
                          ? "bg-emerald-600 text-white"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {copiedId === p.id ? (
                        <>
                          <Check size={13} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Copy
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setModalPrompt(p)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-700 transition"
                    >
                      <Maximize2 size={13} /> Full View
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* ENGINEERING PHILOSOPHY CALLOUT */}
        <section className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <span className="eyebrow text-blue-700">Philosophy</span>
              <h3 className="mt-2 text-2xl font-black text-slate-900">
                Deterministic Prompting for Backend Engineering
              </h3>
            </div>
            <div className="md:col-span-2 space-y-4 text-xs md:text-sm leading-relaxed text-slate-600">
              <p>
                Prompt engineering untuk software architecture bukan sekadar meminta LLM menulis kode acak. Di lingkungan enterprise, kami membutuhkan batasan invariant domain yang ketat, pencegahan domain leaks, idiomatic error handling, serta verifikasi konkurensi.
              </p>
              <p>
                Setiap prompt di atas dirancang dengan struktur *Role, Objective, Architectural Constraints, Adapter Isolation,* dan *Verification Test Scaffolding* untuk memastikan hasil generasi kode siap di-review dan diuji di production pipeline.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FULL PROMPT MODAL */}
      <AnimatePresence>
        {modalPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalPrompt(null)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl border border-slate-700 bg-[#0f172a] shadow-2xl overflow-hidden text-slate-100"
            >
              <div className="flex items-start justify-between border-b border-slate-800 bg-[#0b1020] p-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="rounded-md bg-blue-500/20 px-2.5 py-1 text-xs font-bold text-blue-400 border border-blue-500/30">
                      {modalPrompt.type}
                    </span>
                    {modalPrompt.target_model && (
                      <span className="rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                        {modalPrompt.target_model}
                      </span>
                    )}
                    {modalPrompt.badge && (
                      <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                        {modalPrompt.badge}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white">
                    {modalPrompt.title}
                  </h2>
                  <p className="mt-1 text-xs md:text-sm text-slate-400">
                    {modalPrompt.description}
                  </p>
                </div>

                <button
                  onClick={() => setModalPrompt(null)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {modalPrompt.instructions && (
                <div className="border-b border-slate-800 bg-amber-500/10 px-6 py-3 text-xs text-amber-300 flex items-center gap-2">
                  <BookOpen size={14} className="shrink-0 text-amber-400" />
                  <div>
                    <span className="font-bold">Instructions: </span>
                    {modalPrompt.instructions}
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 bg-[#070b14]">
                <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
                  <span>SYSTEM / TASK PROMPT CONTENT:</span>
                  <span>{modalPrompt.prompt_text.length} characters</span>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-[#050811] p-5">
                  <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm leading-relaxed text-slate-200 selection:bg-blue-600 selection:text-white">
                    {modalPrompt.prompt_text}
                  </pre>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 bg-[#0b1020] px-6 py-4">
                <div className="flex flex-wrap gap-1.5">
                  {modalPrompt.tags?.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleModalCopy(modalPrompt.prompt_text)}
                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
                      isModalCopied
                        ? "bg-emerald-600 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30"
                    }`}
                  >
                    {isModalCopied ? (
                      <>
                        <Check size={16} /> Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy size={16} /> Copy Full Prompt
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setModalPrompt(null)}
                    className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Muhammad Refa Walada Mushtofa. All rights reserved.</p>
          <div className="flex items-center gap-4 font-semibold text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <Link href="/news" className="hover:text-blue-600 transition">News & Devlog</Link>
            <Link href="/#contact" className="hover:text-blue-600 transition">Contact</Link>
            <Link href="/admin" className="hover:text-blue-600 transition">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
