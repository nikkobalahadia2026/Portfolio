import { supabase } from "./supabaseClient";
import type {
  ProfileRow,
  AboutParagraphRow,
  TechCategoryRow,
  TechItemRow,
  ProjectRow,
  ExperienceRow,
  CertificationRow,
  GalleryImageRow,
  MemberOfRow,
  SocialLinkRow,
} from "./dbTypes";

function requireClient() {
  if (!supabase) {
    throw new Error(
      "Supabase isn't configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file."
    );
  }
  return supabase;
}

// ---------- generic helpers for the simple list tables ----------

async function listRows<T>(table: string, orderBy = "sort_order"): Promise<T[]> {
  const client = requireClient();
  const { data, error } = await client.from(table).select("*").order(orderBy, { ascending: true });
  if (error) throw error;
  return (data ?? []) as T[];
}

async function insertRow<T>(table: string, values: Record<string, unknown>): Promise<T> {
  const client = requireClient();
  const { data, error } = await client.from(table).insert(values).select().single();
  if (error) throw error;
  return data as T;
}

async function updateRow<T>(
  table: string,
  id: string,
  values: Record<string, unknown>
): Promise<T> {
  const client = requireClient();
  const { data, error } = await client.from(table).update(values).eq("id", id).select().single();
  if (error) throw error;
  return data as T;
}

async function deleteRow(table: string, id: string) {
  const client = requireClient();
  const { error } = await client.from(table).delete().eq("id", id);
  if (error) throw error;
}

async function reorderRows(table: string, orderedIds: string[]) {
  const client = requireClient();
  await Promise.all(
    orderedIds.map((id, index) => client.from(table).update({ sort_order: index }).eq("id", id))
  );
}

// ---------- profile (singleton) ----------

export async function getProfile(): Promise<ProfileRow | null> {
  const client = requireClient();
  const { data, error } = await client.from("profile").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data as ProfileRow | null;
}

export async function updateProfile(values: Partial<ProfileRow>) {
  const client = requireClient();
  const { data, error } = await client
    .from("profile")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", 1)
    .select()
    .single();
  if (error) throw error;
  return data as ProfileRow;
}

// ---------- about paragraphs ----------

export const about = {
  list: () => listRows<AboutParagraphRow>("about_paragraphs"),
  create: (content: string, sort_order: number) =>
    insertRow<AboutParagraphRow>("about_paragraphs", { content, sort_order }),
  update: (id: string, content: string) =>
    updateRow<AboutParagraphRow>("about_paragraphs", id, { content }),
  remove: (id: string) => deleteRow("about_paragraphs", id),
  reorder: (ids: string[]) => reorderRows("about_paragraphs", ids),
};

// ---------- tech stack ----------

export const techCategories = {
  list: () => listRows<TechCategoryRow>("tech_categories"),
  create: (label: string, sort_order: number) =>
    insertRow<TechCategoryRow>("tech_categories", { label, sort_order }),
  update: (id: string, label: string) =>
    updateRow<TechCategoryRow>("tech_categories", id, { label }),
  remove: (id: string) => deleteRow("tech_categories", id),
  reorder: (ids: string[]) => reorderRows("tech_categories", ids),
};

export const techItems = {
  list: () => listRows<TechItemRow>("tech_items"),
  create: (category_id: string, label: string, sort_order: number) =>
    insertRow<TechItemRow>("tech_items", { category_id, label, sort_order }),
  update: (id: string, label: string) => updateRow<TechItemRow>("tech_items", id, { label }),
  remove: (id: string) => deleteRow("tech_items", id),
  reorder: (ids: string[]) => reorderRows("tech_items", ids),
};

// ---------- projects ----------

export const projects = {
  list: () => listRows<ProjectRow>("projects"),
  create: (values: Omit<ProjectRow, "id">) => insertRow<ProjectRow>("projects", values),
  update: (id: string, values: Partial<ProjectRow>) =>
    updateRow<ProjectRow>("projects", id, values),
  remove: (id: string) => deleteRow("projects", id),
  reorder: (ids: string[]) => reorderRows("projects", ids),
};

// ---------- experience ----------

export const experience = {
  list: () => listRows<ExperienceRow>("experience"),
  create: (values: Omit<ExperienceRow, "id">) =>
    insertRow<ExperienceRow>("experience", values),
  update: (id: string, values: Partial<ExperienceRow>) =>
    updateRow<ExperienceRow>("experience", id, values),
  remove: (id: string) => deleteRow("experience", id),
  reorder: (ids: string[]) => reorderRows("experience", ids),
};

// ---------- certifications ----------

export const certifications = {
  list: () => listRows<CertificationRow>("certifications"),
  create: (values: Omit<CertificationRow, "id">) =>
    insertRow<CertificationRow>("certifications", values),
  update: (id: string, values: Partial<CertificationRow>) =>
    updateRow<CertificationRow>("certifications", id, values),
  remove: (id: string) => deleteRow("certifications", id),
  reorder: (ids: string[]) => reorderRows("certifications", ids),
};

// ---------- gallery ----------

export const gallery = {
  list: () => listRows<GalleryImageRow>("gallery_images"),
  create: (image_url: string, caption: string, sort_order: number) =>
    insertRow<GalleryImageRow>("gallery_images", { image_url, caption, sort_order }),
  update: (id: string, values: Partial<GalleryImageRow>) =>
    updateRow<GalleryImageRow>("gallery_images", id, values),
  remove: (id: string) => deleteRow("gallery_images", id),
  reorder: (ids: string[]) => reorderRows("gallery_images", ids),
};

// ---------- member of ----------

export const memberOf = {
  list: () => listRows<MemberOfRow>("member_of"),
  create: (label: string, url: string, sort_order: number) =>
    insertRow<MemberOfRow>("member_of", { label, url, sort_order }),
  update: (id: string, values: Partial<MemberOfRow>) =>
    updateRow<MemberOfRow>("member_of", id, values),
  remove: (id: string) => deleteRow("member_of", id),
  reorder: (ids: string[]) => reorderRows("member_of", ids),
};

// ---------- social links ----------

export const socialLinks = {
  list: () => listRows<SocialLinkRow>("social_links"),
  create: (label: string, url: string, sort_order: number) =>
    insertRow<SocialLinkRow>("social_links", { label, url, sort_order }),
  update: (id: string, values: Partial<SocialLinkRow>) =>
    updateRow<SocialLinkRow>("social_links", id, values),
  remove: (id: string) => deleteRow("social_links", id),
  reorder: (ids: string[]) => reorderRows("social_links", ids),
};

// ---------- storage (avatar + gallery uploads) ----------

export async function uploadMedia(file: File, folder: "avatar" | "gallery") {
  const client = requireClient();
  const ext = file.name.split(".").pop();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await client.storage.from("portfolio-media").upload(path, file, {
    upsert: false,
  });
  if (error) throw error;
  const { data } = client.storage.from("portfolio-media").getPublicUrl(path);
  return data.publicUrl;
}
