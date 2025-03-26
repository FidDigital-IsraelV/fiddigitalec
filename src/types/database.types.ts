export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  author: string;
  read_time: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  stats: { label: string; value: string }[] | null;
  created_at: string;
  updated_at: string;
}

export type Testimonial = {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  avatar_url: string | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentPlan {
  id: string;
  title: string;
  price: number;
  description: string;
  features: string[];
  is_popular?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Purchase {
  id: string;
  user_id?: string;
  email: string;
  plan_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  payment_details?: any;
  requirements?: string;
  created_at?: string;
  updated_at?: string;
}
