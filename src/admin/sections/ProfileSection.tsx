import { useEffect, useState } from "react";
import { getProfile, updateProfile, uploadMedia } from "../../lib/db";
import type { ProfileRow } from "../../lib/dbTypes";
import { Button, Input, Label, SectionCard } from "../ui";

const EMPTY: Omit<ProfileRow, "id" | "updated_at"> = {
  name: "",
  location: "",
  title: "",
  email: "",
  avatar_url: null,
  degree_program: "",
  degree_class_year: "",
  degree_full_name: "",
};

export default function ProfileSection() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    getProfile().then((row) => {
      if (row) setForm(row);
      setLoading(false);
    });
  }, []);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await updateProfile(form);
      setStatus("Saved.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Couldn't save.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMedia(file, "avatar");
      setForm((f) => ({ ...f, avatar_url: url }));
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="text-sm text-ink-500">Loading…</p>;

  return (
    <div className="space-y-5">
      <SectionCard title="Profile photo">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-paper-dim dark:bg-white/5 flex items-center justify-center shrink-0">
            {form.avatar_url ? (
              <img src={form.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-ink-500">No photo</span>
            )}
          </div>
          <div>
            <label className="cursor-pointer">
              <span className="inline-flex items-center rounded-lg border border-black/10 dark:border-white/10 px-3.5 py-2 text-sm font-medium hover:bg-paper-dim dark:hover:bg-white/5 transition-colors">
                {uploading ? "Uploading…" : "Upload photo"}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Basic info">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={set("name")} />
          </div>
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={set("title")} placeholder="Full-Stack Web Developer" />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={form.location} onChange={set("location")} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={set("email")} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Degree banner" description="Shown in the card on the right side of the page.">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Program</Label>
            <Input value={form.degree_program} onChange={set("degree_program")} />
          </div>
          <div>
            <Label>Class year</Label>
            <Input value={form.degree_class_year} onChange={set("degree_class_year")} />
          </div>
          <div className="sm:col-span-2">
            <Label>Full name</Label>
            <Input value={form.degree_full_name} onChange={set("degree_full_name")} />
          </div>
        </div>
      </SectionCard>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
        {status && <span className="text-sm text-ink-500 dark:text-neutral-400">{status}</span>}
      </div>
    </div>
  );
}
