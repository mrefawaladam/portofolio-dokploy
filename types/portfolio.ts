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

export interface PortfolioData {
  projects: Project[];
  products: Product[];
  news: NewsArticle[];
}
