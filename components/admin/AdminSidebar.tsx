"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  FolderGit2,
  Bookmark,
  Sparkles,
  Newspaper,
  Boxes,
  Layers,
  Briefcase,
  GraduationCap,
  TrendingUp,
  ExternalLink,
  LogOut,
  Database,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export type TabKey =
  | "projects"
  | "products"
  | "prompts"
  | "courses"
  | "modules"
  | "lessons"
  | "news"
  | "experiences"
  | "educations"
  | "stacks"
  | "impact";

export interface NavGroup {
  title: string;
  badge?: string;
  items: {
    key: TabKey;
    label: string;
    description: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Tutorial & Pembelajaran",
    badge: "Coursera Track",
    items: [
      {
        key: "courses",
        label: "Track Kursus",
        description: "Daftar kurikulum kursus utama",
        icon: BookOpen,
      },
      {
        key: "modules",
        label: "Modul Bab",
        description: "Kelompok bab materi per track",
        icon: FolderGit2,
      },
      {
        key: "lessons",
        label: "Pelajaran / Lessons",
        description: "Artikel bacaan & koding Markdown",
        icon: Bookmark,
      },
    ],
  },
  {
    title: "Konten & Publikasi",
    items: [
      {
        key: "prompts",
        label: "AI Prompt Showcase",
        description: "Showcase prompt & workflow AI",
        icon: Sparkles,
      },
      {
        key: "news",
        label: "Artikel & Devlog",
        description: "Tulisan teknis & update devlog",
        icon: Newspaper,
      },
    ],
  },
  {
    title: "Portofolio & Produk",
    items: [
      {
        key: "projects",
        label: "Showcase Projects",
        description: "Karya unggulan & studi kasus",
        icon: Layers,
      },
      {
        key: "products",
        label: "Produk & SaaS",
        description: "Tools & produk yang dirilis",
        icon: Boxes,
      },
      {
        key: "stacks",
        label: "Tech Stacks",
        description: "Kategori & keahlian teknologi",
        icon: Layers,
      },
    ],
  },
  {
    title: "Karir & Pendidikan",
    items: [
      {
        key: "experiences",
        label: "Pengalaman Kerja",
        description: "Riwayat pekerjaan & peran",
        icon: Briefcase,
      },
      {
        key: "educations",
        label: "Pendidikan",
        description: "Riwayat sekolah & studi",
        icon: GraduationCap,
      },
      {
        key: "impact",
        label: "Impact Metrics",
        description: "Statistik dampak & pencapaian",
        icon: TrendingUp,
      },
    ],
  },
];

interface AdminSidebarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  counts?: Partial<Record<TabKey, number>>;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  counts = {},
  onLogout,
  isOpenMobile,
  onCloseMobile,
}: AdminSidebarProps) {
  const content = (
    <div className="flex h-full flex-col justify-between bg-[#0a0f1d] text-slate-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-85">
            <Image
              src="/logo-light.png"
              alt="mrefawm logo"
              width={130}
              height={42}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-[10px] font-bold text-cyan-400 tracking-wide">
            <ShieldCheck size={11} /> Admin
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-slate-400 hover:text-white"
            title="Tutup Menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Database Live Indicator */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/5 px-3 py-2 text-[11px]">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium">PostgreSQL Dokploy</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-semibold">Online</span>
        </div>
      </div>

      {/* Navigation Groups (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {group.title}
              </span>
              {group.badge && (
                <span className="text-[9px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-1.5 py-0.5 rounded">
                  {group.badge}
                </span>
              )}
            </div>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                const count = counts[item.key];

                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      onSelectTab(item.key);
                      onCloseMobile();
                    }}
                    className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/25"
                        : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg transition ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-cyan-400"
                        }`}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0 truncate">
                        <div className={`truncate leading-snug ${isActive ? "text-white" : "text-slate-200"}`}>
                          {item.label}
                        </div>
                        <div className="truncate text-[10px] text-slate-500 group-hover:text-slate-400">
                          {item.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {typeof count === "number" && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold font-mono ${
                            isActive
                              ? "bg-white/25 text-white"
                              : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-slate-300"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                      {isActive && <ChevronRight size={13} className="text-cyan-300" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-white/10 bg-black/20 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition"
        >
          <div className="flex items-center gap-2">
            <ExternalLink size={14} className="text-cyan-400" />
            <span>Lihat Web Live</span>
          </div>
          <span className="text-[10px] text-slate-400">/</span>
        </Link>

        <button
          onClick={onLogout}
          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
        >
          <div className="flex items-center gap-2">
            <LogOut size={14} />
            <span>Keluar / Logout</span>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-72 flex-col fixed inset-y-0 left-0 z-40 border-r border-slate-800 shadow-xl">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
