import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllCourses } from "@/lib/tutorials";
import {
  BookOpen, Clock, Layers3, ArrowRight, ArrowLeft,
  CheckCircle2, Workflow, Cpu, Sparkles, FolderGit2
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Engineering Tutorials & Learning Tracks | Muhammad Refa Walada Mushtofa",
  description:
    "Production-grade engineering tutorials on Distributed Systems, RabbitMQ, Golang, Database Tuning, and Domain-Driven Design by Muhammad Refa Walada Mushtofa.",
  openGraph: {
    title: "Engineering Tutorials & Learning Tracks | Refa Walada Mushtofa",
    description: "Production-grade engineering tutorials and architecture breakdowns.",
    type: "website",
    url: "https://mrefawm.my.id/tutorials",
  },
};

export default function TutorialsCatalogPage() {
  const courses = getAllCourses();

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 hover:text-blue-700"
            >
              <ArrowLeft size={14} /> Back to Portfolio
            </Link>
          </div>

          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-dark.png"
              alt="mrefawm"
              width={120}
              height={40}
              className="h-7 w-auto object-contain"
            />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16 flex-1">
        {/* Header Hero */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 mb-4">
            <Sparkles size={13} className="text-blue-600" />
            <span>Coursera-Style Engineering Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Production-Grade<br />
            <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
              Technical Tutorials.
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">
            Panduan arsitektur sistem nyata yang ditulis langsung dari pengalaman menangani platform healthcare, edtech, dan sistem pembayaran berskala jutaan transaksi.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <article
              key={course.slug}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                    {course.category}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600">
                    {course.level}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition">
                  {course.title}
                </h2>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {course.description}
                </p>

                {/* Modules Outline Preview */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Curriculum Overview ({course.modules.length} Modules · {course.totalLessons} Lessons)
                  </p>
                  <div className="space-y-2">
                    {course.modules.map((m, idx) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between text-xs text-slate-600 bg-slate-50/80 rounded-xl px-3 py-2 border border-slate-100"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="font-mono text-[11px] text-blue-600 font-bold">
                            0{idx + 1}
                          </span>
                          <span className="truncate font-medium">{m.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {m.lessons.length} lessons
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-slate-400" />
                    {course.totalDuration}
                  </span>
                  <span>•</span>
                  <span>Free &amp; Open</span>
                </div>

                <Link
                  href={`/tutorials/${course.slug}/${course.firstLessonSlug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 hover:gap-3"
                >
                  <span>Start Track</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Muhammad Refa Walada Mushtofa</span>
          <Link href="/" className="text-blue-600 font-semibold hover:underline">
            Back to Main Portfolio ↑
          </Link>
        </div>
      </footer>
    </div>
  );
}
