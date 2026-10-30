import { PortfolioData } from "@/types/portfolio";
import { fallbackPortfolioData } from "@/data/fallback-data";

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const res = await fetch("/api/portfolio", { cache: "no-store" });
    if (!res.ok) {
      return fallbackPortfolioData;
    }
    const data = await res.json();
    return {
      projects: data.projects || fallbackPortfolioData.projects,
      products: data.products || fallbackPortfolioData.products,
      news: data.news || fallbackPortfolioData.news,
      experiences: data.experiences || fallbackPortfolioData.experiences,
      educations: data.educations || fallbackPortfolioData.educations,
      stacks: data.stacks || fallbackPortfolioData.stacks,
      impact: data.impact || fallbackPortfolioData.impact,
    };
  } catch (err) {
    return fallbackPortfolioData;
  }
}
