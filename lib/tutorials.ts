import fs from "fs";
import path from "path";
import matter from "gray-matter";
import pool from "@/lib/db";
import { Course, Module, Lesson, LessonMeta, LessonType } from "@/types/tutorial";

const TUTORIALS_DIR = path.join(process.cwd(), "content", "tutorials");

function cleanSlug(name: string): string {
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

/**
 * Fallback: Read courses directly from filesystem Markdown files in content/tutorials/
 */
export function getAllCoursesFromFilesystem(): Course[] {
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

/**
 * Dual-source: fetch all courses from PostgreSQL if available, otherwise from Markdown files
 */
export async function getAllCourses(): Promise<Course[]> {
  if (pool) {
    try {
      const coursesRes = await pool.query(
        "SELECT * FROM public.tutorial_courses WHERE published = true ORDER BY order_index ASC, created_at DESC"
      );

      if (coursesRes.rows.length > 0) {
        const courseIds = coursesRes.rows.map((c) => c.id);

        const [modulesRes, lessonsRes] = await Promise.all([
          pool.query(
            "SELECT * FROM public.tutorial_modules WHERE course_id = ANY($1::uuid[]) ORDER BY order_index ASC",
            [courseIds]
          ),
          pool.query(
            "SELECT * FROM public.tutorial_lessons WHERE course_id = ANY($1::uuid[]) AND published = true ORDER BY order_index ASC",
            [courseIds]
          ),
        ]);

        const courses: Course[] = [];

        for (const cRow of coursesRes.rows) {
          const cModules = modulesRes.rows.filter((m) => m.course_id === cRow.id);
          const cLessons = lessonsRes.rows.filter((l) => l.course_id === cRow.id);

          const builtModules: Module[] = [];
          const allLessonMetas: LessonMeta[] = [];

          for (const mRow of cModules) {
            const mLessons = cLessons.filter((l) => l.module_id === mRow.id);
            const lessonMetas: LessonMeta[] = mLessons.map((lRow) => ({
              slug: lRow.slug,
              title: lRow.title,
              moduleTitle: mRow.title,
              moduleSlug: mRow.slug,
              order: lRow.order_index,
              duration: lRow.duration || "10 min read",
              type: (lRow.type as LessonType) || "reading",
              excerpt: lRow.excerpt || "",
              tags: lRow.tags || [],
            }));

            allLessonMetas.push(...lessonMetas);

            builtModules.push({
              id: mRow.slug,
              title: mRow.title,
              order: mRow.order_index,
              lessons: lessonMetas,
            });
          }

          const totalMinutes = allLessonMetas.reduce((acc, curr) => {
            const match = /(\d+)/.exec(curr.duration);
            return acc + (match ? parseInt(match[1], 10) : 10);
          }, 0);

          const hours = Math.floor(totalMinutes / 60);
          const mins = totalMinutes % 60;
          const totalDurationStr = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

          courses.push({
            slug: cRow.slug,
            title: cRow.title,
            tagline: cRow.tagline || "",
            description: cRow.description || "",
            category: cRow.category || "Backend Engineering",
            level: cRow.level || "Intermediate",
            badge: cRow.badge || "Featured Track",
            icon: cRow.icon || "Workflow",
            order: cRow.order_index,
            totalLessons: allLessonMetas.length,
            totalDuration: totalDurationStr,
            modules: builtModules,
            firstLessonSlug: allLessonMetas.length > 0 ? allLessonMetas[0].slug : "",
          });
        }

        if (courses.length > 0) {
          return courses;
        }
      }
    } catch (err: any) {
      console.warn("PostgreSQL tutorial fetch error, falling back to local files:", err.message);
    }
  }

  return getAllCoursesFromFilesystem();
}

export async function getCourse(courseSlug: string): Promise<Course | null> {
  const courses = await getAllCourses();
  return courses.find((c) => c.slug === courseSlug) || null;
}

export async function getLesson(
  courseSlug: string,
  lessonSlug: string
): Promise<{ course: Course; lesson: Lesson } | null> {
  const course = await getCourse(courseSlug);
  if (!course) return null;

  // 1. Try finding in PostgreSQL if pool is available
  if (pool) {
    try {
      const lessonRes = await pool.query(
        `SELECT l.*, m.title as module_title, m.slug as module_slug 
         FROM public.tutorial_lessons l
         JOIN public.tutorial_courses c ON l.course_id = c.id
         JOIN public.tutorial_modules m ON l.module_id = m.id
         WHERE c.slug = $1 AND l.slug = $2 AND l.published = true
         LIMIT 1`,
        [courseSlug, lessonSlug]
      );

      if (lessonRes.rows.length > 0) {
        const row = lessonRes.rows[0];

        // Determine prev & next lessons
        const flatLessons: LessonMeta[] = [];
        for (const mod of course.modules) {
          for (const les of mod.lessons) {
            flatLessons.push(les);
          }
        }
        const currentIndex = flatLessons.findIndex((l) => l.slug === lessonSlug);
        const prevLesson = currentIndex > 0 ? { slug: flatLessons[currentIndex - 1].slug, title: flatLessons[currentIndex - 1].title } : null;
        const nextLesson =
          currentIndex < flatLessons.length - 1
            ? { slug: flatLessons[currentIndex + 1].slug, title: flatLessons[currentIndex + 1].title }
            : null;

        const lesson: Lesson = {
          slug: row.slug,
          title: row.title,
          moduleTitle: row.module_title,
          moduleSlug: row.module_slug,
          order: row.order_index,
          duration: row.duration,
          type: row.type as LessonType,
          excerpt: row.excerpt,
          tags: row.tags || [],
          content: row.content,
          prevLesson,
          nextLesson,
        };

        return { course, lesson };
      }
    } catch (err: any) {
      console.warn("PostgreSQL getLesson error, falling back to local files:", err.message);
    }
  }

  // 2. Fallback to filesystem
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
