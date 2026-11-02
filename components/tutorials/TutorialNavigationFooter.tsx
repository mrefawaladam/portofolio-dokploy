"use client";

import React from "react";
import Link from "next/link";
import { Course, Lesson } from "@/types/tutorial";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from "lucide-react";

interface TutorialNavigationFooterProps {
  course: Course;
  lesson: Lesson;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

export default function TutorialNavigationFooter({
  course,
  lesson,
  isCompleted,
  onToggleComplete,
}: TutorialNavigationFooterProps) {
  const { prevLesson, nextLesson } = lesson;

  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Previous Button */}
        <div>
          {prevLesson ? (
            <Link
              href={`/tutorials/${course.slug}/${prevLesson.slug}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50 transition"
            >
              <ArrowLeft size={14} />
              <div className="text-left">
                <span className="block text-[9px] font-medium text-slate-400 uppercase tracking-wider">Previous</span>
                <span className="truncate max-w-[150px] sm:max-w-[200px] block">{prevLesson.title}</span>
              </div>
            </Link>
          ) : (
            <div className="text-xs text-slate-400 italic">First lesson of this track</div>
          )}
        </div>

        {/* Mark Completed Button */}
        <div>
          <button
            onClick={onToggleComplete}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition shadow-xs ${
              isCompleted
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50"
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <Circle size={16} className="text-slate-400" />
                <span>Mark as Completed</span>
              </>
            )}
          </button>
        </div>

        {/* Next Button */}
        <div>
          {nextLesson ? (
            <Link
              href={`/tutorials/${course.slug}/${nextLesson.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:brightness-110 transition"
            >
              <div className="text-right">
                <span className="block text-[9px] font-medium text-cyan-100 uppercase tracking-wider">Next Lesson</span>
                <span className="truncate max-w-[150px] sm:max-w-[200px] block">{nextLesson.title}</span>
              </div>
              <ArrowRight size={14} />
            </Link>
          ) : (
            <Link
              href="/tutorials"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition"
            >
              <span>Track Completed! View All</span>
              <CheckCircle2 size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
