import { notFound, redirect } from "next/navigation";
import { getCourse } from "@/lib/tutorials";

interface PageProps {
  params: {
    courseSlug: string;
  };
}

export default async function CourseRedirectPage({ params }: PageProps) {
  const course = await getCourse(params.courseSlug);

  if (!course) {
    notFound();
  }

  if (course.firstLessonSlug) {
    redirect(`/tutorials/${course.slug}/${course.firstLessonSlug}`);
  }

  notFound();
}
