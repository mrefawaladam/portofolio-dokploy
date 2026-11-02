export type LessonType = "reading" | "code" | "architecture" | "video" | "exercise";

export interface LessonMeta {
  slug: string;
  title: string;
  moduleTitle: string;
  moduleSlug: string;
  order: number;
  duration: string;
  type: LessonType;
  excerpt?: string;
  tags?: string[];
  filePath?: string;
}

export interface Lesson extends LessonMeta {
  content: string;
  prevLesson?: { slug: string; title: string } | null;
  nextLesson?: { slug: string; title: string } | null;
}

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: LessonMeta[];
}

export interface Course {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  level: string;
  badge?: string;
  icon?: string;
  order?: number;
  totalLessons: number;
  totalDuration: string;
  modules: Module[];
  firstLessonSlug: string;
}
