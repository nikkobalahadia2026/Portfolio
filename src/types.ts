export interface TechCategory {
  label: string;
  items: string[];
}

export interface ContentBlock {
  type: "paragraph" | "image";
  text?: string;
  url?: string;
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  linkLabel?: string;
  hasStory?: boolean;
  story?: string;
}

export interface ExperienceItem {
  title: string;
  org: string;
  period: string;
  current?: boolean;
}

export interface Certification {
  title: string;
  issuer: string;
  url?: string;
  imageUrl?: string;
}

export interface GalleryImage {
  url: string;
  caption?: string;
}

export interface ProfileData {
  name: string;
  location: string;
  title: string;
  email: string;
  avatarUrl?: string;
  schedulingUrl?: string;
  degree: {
    program: string;
    classYear: string;
    fullName: string;
  };
  about: string[];
  techStack: TechCategory[];
  projects: Project[];
  experience: ExperienceItem[];
  certifications: Certification[];
  gallery: GalleryImage[];
  memberOf: { label: string; url?: string }[];
  social: { label: string; url: string }[];
}