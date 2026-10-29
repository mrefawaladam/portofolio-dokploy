import { supabase } from "./supabase";
import { Project } from "@/types/project";
import { fallbackProjects } from "@/data/fallback-projects";

export async function getProjects(): Promise<Project[]> {
  try {
    if (!supabase) {
      return fallbackProjects;
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase query error, using fallback projects:", error.message);
      return fallbackProjects;
    }

    if (!data || data.length === 0) {
      return fallbackProjects;
    }

    return data as Project[];
  } catch (err) {
    console.warn("Failed to fetch projects from Supabase, using fallback:", err);
    return fallbackProjects;
  }
}
