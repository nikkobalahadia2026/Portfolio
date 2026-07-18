import type { ProfileData } from "../types";

// 👋 Edit everything in this file to make the portfolio yours —
// swap in your real name, photo, email, projects, and links.
export const profile: ProfileData = {
  name: "Nikko Balahadia",
  location: "Batangas, Philippines",
  title: "Full-Stack Web Developer",
  email: "your.email@example.com",
  degree: {
    program: "BS Information Technology",
    classYear: "Class of 2027",
    fullName: "Nikko Balahadia",
  },
  about: [
    "I'm a full-stack web developer and 4th-year IT student, building production-ready apps end to end — from React and Next.js front ends to Supabase-backed data layers.",
    "As the sole developer on several projects, I've shipped a personal finance app, a fitness scheduling tool, and a self-hosted portfolio with an integrated CMS — each taken from idea to a working, deployed product.",
    "I work across TypeScript, React, Next.js, Flutter, and Supabase, with a growing focus on clean architecture and tools people actually use day to day.",
  ],
  techStack: [
    {
      label: "Frontend",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite"],
    },
    {
      label: "Backend & Data",
      items: ["Supabase", "PostgreSQL", "REST APIs", "Node.js"],
    },
    {
      label: "Mobile",
      items: ["Flutter", "Riverpod", "GoRouter", "React Native"],
    },
    {
      label: "Tools & Practice",
      items: ["Git/GitHub", "Figma", "VS Code", "Clean Architecture"],
    },
  ],
  projects: [
    {
      id: "portfolio",
      title: "Developer Portfolio & Admin CMS",
      description:
        "A self-hosted portfolio with a built-in admin panel — every section editable without redeploying, built on Next.js and Supabase.",
      link: "yourdomain.dev",
      linkLabel: "Visit site",
    },
    {
      id: "savewise",
      title: "SaveWise — Personal Finance App",
      description:
        "A Flutter finance tracker with Clean Architecture, Riverpod state management, and live charts for budgeting and spending insight.",
      hasStory: true,
    },
    {
      id: "fittracker",
      title: "FitTracker — Mobile Fitness Scheduler",
      description:
        "A React + Supabase scheduling app for planning workouts, with real-time sync and a mobile-first interface.",
      hasStory: true,
    },
    {
      id: "nam-builders",
      title: "NAM Builders — Company Website & CMS",
      description:
        "A custom-built company site with a dynamic content management system, establishing a digital presence for a local builder.",
      hasStory: true,
    },
    {
      id: "study-buddy",
      title: "Study Buddy",
      description:
        "A collaborative study-planning tool for students to organize sessions, track progress, and share resources.",
      hasStory: true,
    },
  ],
  experience: [
    {
      title: "Full-Stack Web Developer",
      org: "Freelance / Personal Projects",
      period: "2025 – Present",
      current: true,
    },
    {
      title: "BS Information Technology",
      org: "Your University",
      period: "2023 – 2027",
    },
    {
      title: "Hello World!",
      org: "Wrote my first line of code",
      period: "2022",
    },
  ],
  certifications: [
    {
      title: "Add your certification",
      issuer: "Issuing organization",
    },
    {
      title: "Add another certification",
      issuer: "Issuing organization",
    },
  ],
  gallery: [],
  memberOf: [{ label: "Add your student org or community" }],
  social: [
    { label: "GitHub", url: "https://github.com/yourusername" },
    { label: "LinkedIn", url: "https://linkedin.com/in/yourusername" },
  ],
};
