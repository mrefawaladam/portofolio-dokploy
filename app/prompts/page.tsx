import { Metadata } from "next";
import pool from "@/lib/db";
import { fallbackPrompts } from "@/data/fallback-data";
import { PromptShowcase } from "@/types/portfolio";
import PromptsPageClient from "@/components/PromptsPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI & System Prompt Showcase | Muhammad Refa Walada Mushtofa",
  description:
    "Curated collection of battle-tested AI system prompts, Domain-Driven Design (DDD) Golang generators, RabbitMQ event workflows, and autonomous coding agent instructions.",
  openGraph: {
    title: "AI & System Prompt Showcase | Muhammad Refa Walada Mushtofa",
    description:
      "Curated collection of battle-tested AI system prompts, Domain-Driven Design (DDD) Golang generators, and autonomous coding agent instructions.",
    type: "website",
    url: "https://mrefawm.my.id/prompts",
  },
};

async function getPrompts(): Promise<PromptShowcase[]> {
  if (pool) {
    try {
      const res = await pool.query(
        "SELECT * FROM public.prompt_showcases ORDER BY order_index ASC, created_at DESC"
      );
      if (res.rows.length > 0) {
        return res.rows;
      }
    } catch (err) {
      console.error("Error fetching prompt showcases:", err);
    }
  }
  return fallbackPrompts;
}

export default async function PromptsPage() {
  const prompts = await getPrompts();

  return <PromptsPageClient initialPrompts={prompts} />;
}
