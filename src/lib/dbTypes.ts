export interface ProfileRow {
  id: number;
  name: string;
  location: string;
  title: string;
  email: string;
  avatar_url: string | null;
  degree_program: string;
  degree_class_year: string;
  degree_full_name: string;
  scheduling_url: string | null;
  updated_at: string;
}

export interface AboutParagraphRow {
  id: string;
  content: string;
  sort_order: number;
}

export interface TechCategoryRow {
  id: string;
  label: string;
  sort_order: number;
}

export interface TechItemRow {
  id: string;
  category_id: string;
  label: string;
  sort_order: number;
}

export interface ProjectRow {
  id: string;
  title: string;
  description: string;
  link: string | null;
  link_label: string | null;
  has_story: boolean;
  sort_order: number;
}

export interface ExperienceRow {
  id: string;
  title: string;
  org: string;
  period: string;
  is_current: boolean;
  sort_order: number;
}

export interface CertificationRow {
  id: string;
  title: string;
  issuer: string;
  url: string | null;
  sort_order: number;
}

export interface GalleryImageRow {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface MemberOfRow {
  id: string;
  label: string;
  url: string | null;
  sort_order: number;
}

export interface SocialLinkRow {
  id: string;
  label: string;
  url: string;
  sort_order: number;
}
