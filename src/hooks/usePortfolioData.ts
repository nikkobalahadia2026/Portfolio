import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";
import {
  getProfile,
  about,
  techCategories,
  techItems,
  projects as projectsApi,
  experience as experienceApi,
  certifications as certificationsApi,
  gallery as galleryApi,
  memberOf as memberOfApi,
  socialLinks as socialLinksApi,
} from "../lib/db";
import { profile as fallbackProfile } from "../data/portfolioData";
import type { ProfileData } from "../types";

async function loadFromSupabase(): Promise<ProfileData> {
  const [
    profileRow,
    aboutRows,
    categoryRows,
    itemRows,
    projectRows,
    experienceRows,
    certRows,
    galleryRows,
    memberRows,
    socialRows,
  ] = await Promise.all([
    getProfile(),
    about.list(),
    techCategories.list(),
    techItems.list(),
    projectsApi.list(),
    experienceApi.list(),
    certificationsApi.list(),
    galleryApi.list(),
    memberOfApi.list(),
    socialLinksApi.list(),
  ]);

  return {
    name: profileRow?.name || fallbackProfile.name,
    location: profileRow?.location || fallbackProfile.location,
    title: profileRow?.title || fallbackProfile.title,
    email: profileRow?.email || fallbackProfile.email,
    avatarUrl: profileRow?.avatar_url ?? undefined,
    degree: {
      program: profileRow?.degree_program || fallbackProfile.degree.program,
      classYear: profileRow?.degree_class_year || fallbackProfile.degree.classYear,
      fullName: profileRow?.degree_full_name || fallbackProfile.degree.fullName,
    },
    about: aboutRows.length > 0 ? aboutRows.map((a) => a.content) : fallbackProfile.about,
    techStack:
      categoryRows.length > 0
        ? categoryRows.map((cat) => ({
            label: cat.label,
            items: itemRows.filter((i) => i.category_id === cat.id).map((i) => i.label),
          }))
        : fallbackProfile.techStack,
    projects:
      projectRows.length > 0
        ? projectRows.map((p) => ({
            title: p.title,
            description: p.description,
            link: p.link ?? undefined,
            linkLabel: p.link_label ?? undefined,
            hasStory: p.has_story,
          }))
        : fallbackProfile.projects,
    experience:
      experienceRows.length > 0
        ? experienceRows.map((e) => ({
            title: e.title,
            org: e.org,
            period: e.period,
            current: e.is_current,
          }))
        : fallbackProfile.experience,
    certifications:
      certRows.length > 0
        ? certRows.map((c) => ({ title: c.title, issuer: c.issuer, url: c.url ?? undefined }))
        : fallbackProfile.certifications,
    gallery: galleryRows.map((g) => ({ url: g.image_url, caption: g.caption ?? undefined })),
    memberOf:
      memberRows.length > 0
        ? memberRows.map((m) => ({ label: m.label, url: m.url ?? undefined }))
        : fallbackProfile.memberOf,
    social: socialRows.length > 0 ? socialRows.map((s) => ({ label: s.label, url: s.url })) : fallbackProfile.social,
  };
}

export function usePortfolioData() {
  const [data, setData] = useState<ProfileData>(fallbackProfile);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setData(fallbackProfile);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fresh = await loadFromSupabase();
      setData(fresh);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: unknown }).message)
            : "Failed to load portfolio content.";
      console.error("Portfolio content failed to load:", err);
      setError(message);
      setData(fallbackProfile);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // Keep the public page live if content changes while it's open (e.g. admin
  // editing in another tab) by refetching whenever auth state changes and on
  // a light polling interval — cheap for a low-traffic personal site.
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const interval = setInterval(reload, 60_000);
    return () => clearInterval(interval);
  }, [reload]);

  return { data, loading, error, reload };
}
