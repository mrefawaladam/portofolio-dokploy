import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Course, Module, Lesson, LessonMeta, LessonType } from "@/types/tutorial";

const TUTORIALS_DIR = path.join(process.cwd(), "content", "tutorials");

function cleanSlug(name: string): string {
  // Strip leading numbers like "01-"
  return name.replace(/^\d+[-_]/, "").replace(/\.md$/, "");
}

function formatTitleFromSlug(slug: string): string {
  return slug
    .replace(/^\d+[-_]/, "")
    .replace(/\.md$/, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getAllCourses(): Course[] {
  if (!fs.existsSync(TUTORIALS_DIR)) {
    return [];
  }

  const courseDirs = fs
    .readdirSync(TUTORIALS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const courses: Course[] = [];

  for (const dirName of courseDirs) {
    const courseDir = path.join(TUTORIALS_DIR, dirName);
    const metaPath = path.join(courseDir, "meta.json");

    let meta: any = {};
    if (fs.existsSync(metaPath)) {
      try {
        meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      } catch (e) {
        console.error(`Failed to parse meta.json in ${dirName}:`, e);
      }
    }

    const courseSlug = meta.slug || cleanSlug(dirName);
    const modules: Module[] = [];
    const allLessonMetas: LessonMeta[] = [];

    // Scan modules
    const moduleEntries = fs
      .readdirSync(courseDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    for (let mIdx = 0; mIdx < moduleEntries.length; mIdx++) {
      const modEntry = moduleEntries[mIdx];
      const moduleDir = path.join(courseDir, modEntry.name);
      const moduleSlug = cleanSlug(modEntry.name);
      const defaultModTitle = formatTitleFromSlug(modEntry.name);

      const lessonFiles = fs
        .readdirSync(moduleDir, { withFileTypes: true })
        .filter((f) => f.isFile() && f.name.endsWith(".md"))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      const moduleLessons: LessonMeta[] = [];

      for (let lIdx = 0; lIdx < lessonFiles.length; lIdx++) {
        const file = lessonFiles[lIdx];
        const filePath = path.join(moduleDir, file.name);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(fileContent);

        const lessonSlug = data.slug || cleanSlug(file.name);
        const lessonMeta: LessonMeta = {
          slug: lessonSlug,
          title: data.title || formatTitleFromSlug(file.name),
          moduleTitle: data.module || defaultModTitle,
          moduleSlug: moduleSlug,
          order: data.order ?? lIdx + 1,
          duration: data.duration || "10 min read",
          type: (data.type as LessonType) || "reading",
          excerpt: data.excerpt || "",
          tags: Array.isArray(data.tags) ? data.tags : [],
          filePath: path.relative(process.cwd(), filePath),
        };

        moduleLessons.push(lessonMeta);
        allLessonMetas.push(lessonMeta);
      }

      if (moduleLessons.length > 0) {
        const detectedTitle = moduleLessons[0].moduleTitle || defaultModTitle;
        modules.push({
          id: moduleSlug,
          title: detectedTitle,
          order: mIdx + 1,
          lessons: moduleLessons,
        });
      }
    }

    // Calculate total duration roughly
    const totalMinutes = allLessonMetas.reduce((acc, curr) => {
      const match = /(\d+)/.exec(curr.duration);
      return acc + (match ? parseInt(match[1], 10) : 10);
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const totalDurationStr = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

    courses.push({
      slug: courseSlug,
      title: meta.title || formatTitleFromSlug(dirName),
      tagline: meta.tagline || "",
      description: meta.description || "",
      category: meta.category || "Backend Engineering",
      level: meta.level || "Intermediate",
      badge: meta.badge || "Featured Track",
      icon: meta.icon || "Workflow",
      order: meta.order ?? 1,
      totalLessons: allLessonMetas.length,
      totalDuration: meta.totalDuration || totalDurationStr,
      modules,
      firstLessonSlug: allLessonMetas.length > 0 ? allLessonMetas[0].slug : "",
    });
  }

  return courses.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function getCourse(courseSlug: string): Course | null {
  const courses = getAllCourses();
  return courses.find((c) => c.slug === courseSlug) || null;
}

export function getLesson(courseSlug: string, lessonSlug: string): { course: Course; lesson: Lesson } | null {
  const course = getCourse(courseSlug);
  if (!course) return null;

  // Flatten all lessons in order
  const flatLessons: LessonMeta[] = [];
  for (const mod of course.modules) {
    for (const les of mod.lessons) {
      flatLessons.push(les);
    }
  }

  const currentIndex = flatLessons.findIndex((l) => l.slug === lessonSlug);
  if (currentIndex === -1) return null;

  const targetMeta = flatLessons[currentIndex];
  if (!targetMeta.filePath) return null;

  const absolutePath = path.join(process.cwd(), targetMeta.filePath);
  if (!fs.existsSync(absolutePath)) return null;

  const rawFile = fs.readFileSync(absolutePath, "utf-8");
  const { data, content } = matter(rawFile);

  const prevLesson = currentIndex > 0 ? { slug: flatLessons[currentIndex - 1].slug, title: flatLessons[currentIndex - 1].title } : null;
  const nextLesson =
    currentIndex < flatLessons.length - 1
      ? { slug: flatLessons[currentIndex + 1].slug, title: flatLessons[currentIndex + 1].title }
      : null;

  const lesson: Lesson = {
    ...targetMeta,
    title: data.title || targetMeta.title,
    duration: data.duration || targetMeta.duration,
    type: (data.type as LessonType) || targetMeta.type,
    excerpt: data.excerpt || targetMeta.excerpt,
    tags: Array.isArray(data.tags) ? data.tags : targetMeta.tags,
    content,
    prevLesson,
    nextLesson,
  };

  return { course, lesson };
}
