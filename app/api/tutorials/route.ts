import { NextResponse } from "next/server";
import { getAllCourses } from "@/lib/tutorials";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const courses = await getAllCourses();
    return NextResponse.json({ courses });
  } catch (err: any) {
    console.error("Failed to load tutorials in API:", err);
    return NextResponse.json({ courses: [], error: err.message }, { status: 500 });
  }
}
