"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Maximize2,
  X,
  Sparkles,
  Bot,
  Layers,
  Terminal,
  Hash,
  Filter,
  RotateCcw,
  BookOpen,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import { PromptShowcase } from "@/types/portfolio";

interface PromptShowcaseCarouselProps {
  prompts: PromptShowcase[];
}

export default function PromptShowcaseCarousel({ prompts }: PromptShowcaseCarouselProps) {
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalPrompt, setModalPrompt] = useState<PromptShowcase | null>(null);
  const [isModalCopied, setIsModalCopied] = useState<boolean>(false);

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

  // Filtered prompts based on type and tag
  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      const matchType = selectedType === "All" || p.type === selectedType;
      const matchTag =
        selectedTag === "All" ||
        p.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
      return matchType && matchTag;
    });
  }, [prompts, selectedType, selectedTag]);

  // Reset index if filtered list changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedType, selectedTag]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalPrompt) {
        if (e.key === "Escape") setModalPrompt(null);
        return;
      }
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredPrompts.length, currentIndex, modalPrompt]);

  const handleNext = useCallback(() => {
    if (filteredPrompts.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % filteredPrompts.length);
  }, [filteredPrompts.length]);

  const handlePrev = useCallback(() => {
    if (filteredPrompts.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + filteredPrompts.length) % filteredPrompts.length);
  }, [filteredPrompts.length]);

  const handleCopyPrompt = async (prompt: PromptShowcase, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.prompt_text);
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2200);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = prompt.prompt_text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2200);
    }
  };

  const handleModalCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsModalCopied(true);
      setTimeout(() => setIsModalCopied(false), 2200);
    } catch {
      setIsModalCopied(true);
      setTimeout(() => setIsModalCopied(false), 2200);
    }
  };

  const activePrompt = filteredPrompts[currentIndex] || null;

  // Calculate word and character count
  const promptStats = useMemo(() => {
    if (!activePrompt) return { words: 0, chars: 0 };
    const text = activePrompt.prompt_text || "";
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return { words, chars: text.length };
  }, [activePrompt]);

  return (
    <div className="relative w-full">
      {/* FILTER CONTROLS BAR */}
      <div className="mb-8 flex flex-col gap-4">
        {/* Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
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

        {/* Tag Filter Cloud */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mr-1">
              <Hash size={13} className="text-blue-600" /> Tags:
            </span>
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

            {(selectedType !== "All" || selectedTag !== "All") && (
              <button
                onClick={() => {
                  setSelectedType("All");
                  setSelectedTag("All");
                }}
                className="ml-2 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition"
                title="Reset filters"
              >
                <RotateCcw size={11} /> Reset
              </button>
            )}
          </div>
        )}
      </div>

      {/* CAROUSEL BODY */}
      {filteredPrompts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
            <Sparkles size={26} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No prompts found</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            No prompts match your selected type &apos;{selectedType}&apos; and tag &apos;{selectedTag}&apos;.
          </p>
          <button
            onClick={() => {
              setSelectedType("All");
              setSelectedTag("All");
            }}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <RotateCcw size={13} /> Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* CAROUSEL HEADER & NAVIGATION BUTTONS */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200/60">
                <Sparkles size={13} />
                Slide {currentIndex + 1} of {filteredPrompts.length}
              </span>
              <span className="text-xs text-slate-400">
                ({filteredPrompts.length} prompts in view)
              </span>
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={filteredPrompts.length <= 1}
                aria-label="Previous Prompt"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-400 hover:text-blue-600 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Progress Indicator dots */}
              <div className="flex items-center gap-1.5 px-2">
                {filteredPrompts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? "w-8 bg-blue-600"
                        : "w-2.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={filteredPrompts.length <= 1}
                aria-label="Next Prompt"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-400 hover:text-blue-600 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* ACTIVE PROMPT CARD SLIDE */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50">
            <AnimatePresence mode="wait">
              {activePrompt && (
                <motion.div
                  key={activePrompt.id || activePrompt.slug}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="p-6 md:p-8"
                >
                  {/* Top Bar: Meta & Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Type Badge */}
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200/50">
                        <Layers size={13} />
                        {activePrompt.type}
                      </span>

                      {/* Target Model Pill */}
                      {activePrompt.target_model && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200/50">
                          <Bot size={13} />
                          {activePrompt.target_model}
                        </span>
                      )}

                      {/* Special Badge */}
                      {activePrompt.badge && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/50">
                          <CheckCircle2 size={13} />
                          {activePrompt.badge}
                        </span>
                      )}
                    </div>

                    {/* Word / Char stats & Action buttons */}
                    <div className="flex items-center gap-3">
                      <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                        {promptStats.words} words · {promptStats.chars} chars
                      </span>

                      <button
                        onClick={(e) => handleCopyPrompt(activePrompt, e)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                          copiedId === activePrompt.id
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                            : "bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                        }`}
                      >
                        {copiedId === activePrompt.id ? (
                          <>
                            <Check size={14} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={14} /> Copy Prompt
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setModalPrompt(activePrompt)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                        title="Expand full prompt in modal view"
                      >
                        <Maximize2 size={14} />
                        <span className="hidden sm:inline">Expand</span>
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="mt-6">
                    <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                      {activePrompt.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600 max-w-3xl">
                      {activePrompt.description}
                    </p>
                  </div>

                  {/* Tag Pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {activePrompt.tags?.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTag(t)}
                        className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition"
                      >
                        #{t}
                      </button>
                    ))}
                  </div>

                  {/* Usage Tip / Instructions if present */}
                  {activePrompt.instructions && (
                    <div className="mt-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                      <BookOpen size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-800">Usage Instructions: </span>
                        <span>{activePrompt.instructions}</span>
                      </div>
                    </div>
                  )}

                  {/* PROMPT CODE EDITOR VIEW CONTAINER */}
                  <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1020] shadow-2xl">
                    {/* Terminal Titlebar */}
                    <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 py-2.5 text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block" />
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
                        </div>
                        <span className="ml-2 font-semibold text-slate-300 flex items-center gap-1.5">
                          <Terminal size={13} className="text-cyan-400" />
                          {activePrompt.slug || "prompt"}.md
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="hidden sm:inline text-slate-500">Markdown Prompt</span>
                        <button
                          onClick={(e) => handleCopyPrompt(activePrompt, e)}
                          className="inline-flex items-center gap-1 rounded bg-slate-800/80 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700 hover:text-white transition"
                        >
                          {copiedId === activePrompt.id ? (
                            <>
                              <Check size={11} className="text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Prompt Text Preview Box */}
                    <div className="max-h-[380px] overflow-y-auto p-5 text-xs font-mono leading-relaxed text-slate-300 scrollbar-thin scrollbar-thumb-slate-700">
                      <pre className="whitespace-pre-wrap font-mono selection:bg-blue-600 selection:text-white">
                        {activePrompt.prompt_text}
                      </pre>
                    </div>

                    {/* Bottom Prompt Bar */}
                    <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-950/60 px-4 py-2.5 text-[11px] text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Cpu size={12} className="text-cyan-400" />
                          Ready for: {activePrompt.target_model || "Universal LLM"}
                        </span>
                      </div>
                      <button
                        onClick={() => setModalPrompt(activePrompt)}
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition font-semibold"
                      >
                        <Maximize2 size={12} />
                        View Full Screen
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* THUMBNAIL / CAROUSEL STRIP SELECTOR */}
          {filteredPrompts.length > 1 && (
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                All Prompts in this View ({filteredPrompts.length}):
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPrompts.map((p, idx) => {
                  const isSelected = idx === currentIndex;
                  return (
                    <button
                      key={p.id || p.slug}
                      onClick={() => setCurrentIndex(idx)}
                      className={`group flex flex-col justify-between rounded-2xl p-4 text-left transition-all ${
                        isSelected
                          ? "border-2 border-blue-600 bg-blue-50/40 shadow-sm"
                          : "border border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                            {p.type}
                          </span>
                          {p.badge && (
                            <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {p.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="mt-2 text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-700 transition">
                          {p.title}
                        </h4>
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                          {p.description}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                        <span>{p.target_model || "LLM Prompt"}</span>
                        <span className="font-semibold text-blue-600 group-hover:underline">
                          {isSelected ? "● Active" : "View →"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FULL PROMPT MODAL */}
      <AnimatePresence>
        {modalPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalPrompt(null)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl border border-slate-700 bg-[#0f172a] shadow-2xl overflow-hidden text-slate-100"
            >
              {/* Modal Header */}
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

              {/* Instructions Bar */}
              {modalPrompt.instructions && (
                <div className="border-b border-slate-800 bg-amber-500/10 px-6 py-3 text-xs text-amber-300 flex items-center gap-2">
                  <BookOpen size={14} className="shrink-0 text-amber-400" />
                  <div>
                    <span className="font-bold">Instructions: </span>
                    {modalPrompt.instructions}
                  </div>
                </div>
              )}

              {/* Modal Body: Prompt Code */}
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

              {/* Modal Footer */}
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
    </div>
  );
}
