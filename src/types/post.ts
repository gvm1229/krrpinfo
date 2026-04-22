export interface Post {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  pub_date: string;
  thumbnail: string;
  tags: string[];
  keywords: string[] | null;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}
