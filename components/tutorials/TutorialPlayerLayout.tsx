"use client";

import React, { useState, useEffect } from "react";
import { Course, Lesson } from "@/types/tutorial";
import TutorialHeader from "./TutorialHeader";
import TutorialSidebar from "./TutorialSidebar";
import TutorialNavigationFooter from "./TutorialNavigationFooter";
import MarkdownViewer from "@/components/MarkdownViewer";
import { Clock, Tag, BookOpen, Layers3 } from "lucide-react";

interface TutorialPlayerLayoutProps {
  course: Course;
  lesson: Lesson;
}

export default function TutorialPlayerLayout({
  course,
  lesson,
}: TutorialPlayerLayoutProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const storageKey = `refa_tutorial_progress_${course.slug}`;

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCompletedLessons(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not read tutorial progress from localStorage:", e);
    }
  }, [storageKey]);

  // Toggle complete state
  const handleToggleComplete = (slugToToggle: string = lesson.slug) => {
    setCompletedLessons((prev) => {
      const isCompleted = prev.includes(slugToToggle);
      const updated = isCompleted
        ? prev.filter((s) => s !== slugToToggle)
        : [...prev, slugToToggle];

      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save tutorial progress to localStorage:", e);
      }
      return updated;
    });
  };

  const isCurrentCompleted = completedLessons.includes(lesson.slug);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      {/* Top Navbar */}
      <TutorialHeader
        course={course}
        lesson={lesson}
        onOpenMobileSidebar={() => setIsOpenMobile(true)}
      />

      <div className="flex-1 flex max-w-[1700px] w-full mx-auto">
        {/* Left Coursera Sidebar */}
        <TutorialSidebar
          course={course}
          currentLessonSlug={lesson.slug}
          completedLessons={completedLessons}
          onToggleComplete={(slug) => handleToggleComplete(slug)}
          isOpenOnMobile={isOpenMobile}
          onCloseMobile={() => setIsOpenMobile(false)}
        />

        {/* Main Content Viewer */}
        <main className="flex-1 min-w-0 px-5 sm:px-10 lg:px-14 py-8 md:py-12 max-w-4xl mx-auto">
          {/* Lesson Metadata Header */}
          <div className="mb-8 pb-6 border-b border-slate-200/80">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                <BookOpen size={12} />
                {lesson.moduleTitle}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
                <Clock size={12} />
                {lesson.duration}
              </span>
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-700">
                {lesson.type}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              {lesson.title}
            </h1>

            {lesson.excerpt && (
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 bg-white/80 p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                {lesson.excerpt}
              </p>
            )}

            {lesson.tags && lesson.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {lesson.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-600"
                  >
                    <Tag size={10} className="text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Render Markdown Content */}
          <article className="prose-content">
            <MarkdownViewer content={lesson.content} />
          </article>

          {/* Previous / Next / Mark Complete Navigation */}
          <TutorialNavigationFooter
            course={course}
            lesson={lesson}
            isCompleted={isCurrentCompleted}
            onToggleComplete={() => handleToggleComplete(lesson.slug)}
          />
        </main>
      </div>
    </div>
  );
}
