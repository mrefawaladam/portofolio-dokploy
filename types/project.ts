export interface Project {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  tags: string[];
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  featured?: boolean;
  order_index?: number;
  created_at?: string;
}
