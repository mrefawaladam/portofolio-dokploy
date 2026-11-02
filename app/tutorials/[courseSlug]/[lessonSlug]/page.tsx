import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLesson, getAllCourses } from "@/lib/tutorials";
import TutorialPlayerLayout from "@/components/tutorials/TutorialPlayerLayout";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    courseSlug: string;
    lessonSlug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await getLesson(params.courseSlug, params.lessonSlug);
  if (!result) {
    return { title: "Lesson Not Found | Refa's Tutorials" };
  }

  const { course, lesson } = result;
  return {
    title: `${lesson.title} — ${course.title} | Refa Walada Mushtofa`,
    description: lesson.excerpt || `${lesson.title} tutorial on ${course.title}`,
    openGraph: {
      title: `${lesson.title} | ${course.title}`,
      description: lesson.excerpt || course.description,
      type: "article",
    },
  };
}

export default async function LessonDetailPage({ params }: PageProps) {
  const result = await getLesson(params.courseSlug, params.lessonSlug);

  if (!result) {
    notFound();
  }

  return <TutorialPlayerLayout course={result.course} lesson={result.lesson} />;
}
