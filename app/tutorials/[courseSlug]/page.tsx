import { notFound, redirect } from "next/navigation";
import { getCourse } from "@/lib/tutorials";

interface PageProps {
  params: {
    courseSlug: string;
  };
}

export default function CourseRedirectPage({ params }: PageProps) {
  const course = getCourse(params.courseSlug);

  if (!course) {
    notFound();
  }

  if (course.firstLessonSlug) {
    redirect(`/tutorials/${course.slug}/${course.firstLessonSlug}`);
  }

  notFound();
}
