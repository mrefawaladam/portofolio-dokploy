"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Course, Module, LessonMeta } from "@/types/tutorial";
import {
  CheckCircle2, Circle, ChevronDown, ChevronRight, BookOpen,
  Code2, FileText, Cpu, ArrowLeft, X
} from "lucide-react";

interface TutorialSidebarProps {
  course: Course;
  currentLessonSlug: string;
  completedLessons: string[];
  onToggleComplete: (slug: string) => void;
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
}

function getLessonIcon(type: string) {
  switch (type) {
    case "code":
      return <Code2 size={13} className="text-cyan-600 shrink-0" />;
    case "architecture":
      return <Cpu size={13} className="text-blue-600 shrink-0" />;
    default:
      return <FileText size={13} className="text-slate-400 shrink-0" />;
  }
}

export default function TutorialSidebar({
  course,
  currentLessonSlug,
  completedLessons,
  onToggleComplete,
  isOpenOnMobile,
  onCloseMobile,
}: TutorialSidebarProps) {
  // All modules expanded by default
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});

  const toggleModule = (modId: string) => {
    setCollapsedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const totalLessons = course.totalLessons || 1;
  const completedCount = completedLessons.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Sidebar Course Header */}
      <div className="p-5 border-b border-slate-100 bg-[#f8fafc]">
        <Link
          href="/tutorials"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition mb-3"
        >
          <ArrowLeft size={13} /> Back to Tutorials
        </Link>
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-1.5">
              {course.category}
            </span>
            <h2 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
              {course.title}
            </h2>
          </div>
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Learning Progress Bar (Coursera Style) */}
        <div className="mt-4 pt-3 border-t border-slate-200/60">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1.5">
            <span>Course Progress</span>
            <span className="font-bold text-blue-700">
              {completedCount} / {totalLessons} ({progressPercent}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Curriculum / Table of Contents (Daftar Isi) */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {course.modules.map((mod, modIndex) => {
          const isCollapsed = !!collapsedModules[mod.id];
          return (
            <div key={mod.id} className="py-2">
              {/* Module Header Accordion */}
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="text-blue-600 shrink-0 font-mono text-[11px]">
                    {String(modIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate">{mod.title}</span>
                </div>
                {isCollapsed ? (
                  <ChevronRight size={14} className="text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown size={14} className="text-slate-400 shrink-0" />
                )}
              </button>

              {/* Lesson Items */}
              {!isCollapsed && (
                <div className="mt-1 space-y-0.5">
                  {mod.lessons.map((lesson) => {
                    const isActive = lesson.slug === currentLessonSlug;
                    const isCompleted = completedLessons.includes(lesson.slug);

                    return (
                      <div
                        key={lesson.slug}
                        className={`group flex items-start justify-between px-5 py-2.5 transition text-xs ${
                          isActive
                            ? "bg-blue-50/90 border-l-4 border-blue-600 text-blue-900 font-semibold"
                            : "hover:bg-slate-50/80 text-slate-700 border-l-4 border-transparent"
                        }`}
                      >
                        {/* Checkbox for Mark Complete */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggleComplete(lesson.slug);
                          }}
                          className="mt-0.5 mr-2.5 shrink-0 text-slate-300 hover:text-emerald-600 transition"
                          title={isCompleted ? "Mark as uncompleted" : "Mark as completed"}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={16} className="text-emerald-600" />
                          ) : (
                            <Circle size={16} className="hover:text-slate-400" />
                          )}
                        </button>

                        {/* Lesson Link */}
                        <Link
                          href={`/tutorials/${course.slug}/${lesson.slug}`}
                          onClick={onCloseMobile}
                          className="flex-1 min-w-0"
                        >
                          <p className={`line-clamp-2 leading-snug ${isActive ? "text-blue-900 font-bold" : "text-slate-800"}`}>
                            {lesson.title}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                            {getLessonIcon(lesson.type)}
                            <span className="capitalize">{lesson.type}</span>
                            <span>•</span>
                            <span>{lesson.duration}</span>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent Column) */}
      <aside className="hidden md:block w-80 lg:w-96 shrink-0 h-[calc(100vh-65px)] sticky top-[65px] shadow-sm">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide-Over) */}
      {isOpenOnMobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-[84%] max-w-sm bg-white shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
