import { Project } from "@/types/portfolio";
import { fallbackProjects } from "@/data/fallback-data";
import { getPortfolioData } from "./portfolio";

export async function getProjects(): Promise<Project[]> {
  try {
    const data = await getPortfolioData();
    return data.projects || fallbackProjects;
  } catch (err) {
    return fallbackProjects;
  }
}
