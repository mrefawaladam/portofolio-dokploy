"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Course, Lesson } from "@/types/tutorial";
import { Menu, ChevronRight, BookOpen, ExternalLink } from "lucide-react";

interface TutorialHeaderProps {
  course: Course;
  lesson: Lesson;
  onOpenMobileSidebar: () => void;
}

export default function TutorialHeader({
  course,
  lesson,
  onOpenMobileSidebar,
}: TutorialHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[65px] items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 md:px-8 backdrop-blur">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
          aria-label="Open Course Menu"
        >
          <Menu size={18} />
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 mr-2">
          <Image
            src="/logo-dark.png"
            alt="mrefawm logo"
            width={110}
            height={36}
            className="h-6 w-auto object-contain"
          />
        </Link>

        {/* Breadcrumbs Navigation */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500">
          <ChevronRight size={14} className="text-slate-300" />
          <Link href="/tutorials" className="hover:text-blue-600 transition">
            Tutorials
          </Link>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="font-semibold text-slate-700 truncate max-w-xs">
            {course.title}
          </span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-blue-700 font-medium truncate max-w-xs">
            {lesson.title}
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition"
        >
          Main Portfolio <ExternalLink size={12} />
        </Link>
        <Link
          href="/tutorials"
          className="rounded-full bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition"
        >
          All Tracks
        </Link>
      </div>
    </header>
  );
}
