export interface Project {
  id: string;
  slug?: string;
  title: string;
  tagline?: string;
  description: string;
  category?: string;
  tags: string[];
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  metrics?: string;
  featured?: boolean;
  order_index?: number;
  created_at?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  headline: string;
  description: string;
  status: "Live" | "Beta" | "In Development" | "Concept";
  pricing_type: string;
  product_url?: string;
  github_url?: string;
  badge?: string;
  icon_name?: string;
  order_index?: number;
  created_at?: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  cover_image?: string;
  read_time: string;
  tags: string[];
  published: boolean;
  published_at: string;
}

export interface Experience {
  id: string;
  period: string;
  company: string;
  brand: string;
  role: string;
  detail: string;
  tags: string[];
  url?: string;
  order_index?: number;
  created_at?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  detail: string;
  order_index?: number;
  created_at?: string;
}

export interface TechStack {
  id: string;
  title: string;
  icon_name: string;
  note: string;
  tags: string[];
  grid_span?: string;
  order_index?: number;
}

export interface ImpactMetric {
  id: string;
  metric: string;
  title: string;
  detail: string;
  order_index?: number;
}

export interface PromptShowcase {
  id: string;
  slug: string;
  title: string;
  type: string;
  description: string;
  prompt_text: string;
  tags: string[];
  target_model?: string;
  badge?: string;
  instructions?: string;
  order_index?: number;
  created_at?: string;
}

export interface PortfolioData {
  projects: Project[];
  products: Product[];
  prompts?: PromptShowcase[];
  news: NewsArticle[];
  experiences?: Experience[];
  educations?: Education[];
  stacks?: TechStack[];
  impact?: ImpactMetric[];
}
