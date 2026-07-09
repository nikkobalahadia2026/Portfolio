import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { socialLinks, memberOf } from "../../lib/db";
import type { SocialLinkRow, MemberOfRow } from "../../lib/dbTypes";
import { Button, Input, Label, SectionCard } from "../ui";

export default function LinksSection() {
  const [social, setSocial] = useState<SocialLinkRow[]>([]);
  const [orgs, setOrgs] = useState<MemberOfRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [s, o] = await Promise.all([socialLinks.list(), memberOf.list()]);
    setSocial(s);
    setOrgs(o);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  // ---- social links ----
  const updateSocialLocal = (id: string, patch: Partial<SocialLinkRow>) =>
    setSocial((s) => s.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  const saveSocial = (row: SocialLinkRow) => socialLinks.update(row.id, row);
  const addSocial = async () => {
    const created = await socialLinks.create("GitHub", "https://github.com/yourusername", social.length);
    setSocial((s) => [...s, created as SocialLinkRow]);
  };
  const deleteSocial = async (id: string) => {
    await socialLinks.remove(id);
    setSocial((s) => s.filter((row) => row.id !== id));
  };

  // ---- member of ----
  const updateOrgLocal = (id: string, patch: Partial<MemberOfRow>) =>
    setOrgs((o) => o.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  const saveOrg = (row: MemberOfRow) => memberOf.update(row.id, row);
  const addOrg = async () => {
    const created = await memberOf.create("Your organization", "", orgs.length);
    setOrgs((o) => [...o, created as MemberOfRow]);
  };
  const deleteOrg = async (id: string) => {
    await memberOf.remove(id);
    setOrgs((o) => o.filter((row) => row.id !== id));
  };

  if (loading) return <p className="text-sm text-ink-500">Loading…</p>;

  return (
    <div className="space-y-5">
      <SectionCard title="Social Links">
        <div className="space-y-3">
          {social.map((row) => (
            <div key={row.id} className="flex flex-col sm:flex-row gap-2 sm:items-end">
              <div className="flex-1">
                <Label>Label</Label>
                <Input
                  value={row.label}
                  onChange={(e) => updateSocialLocal(row.id, { label: e.target.value })}
                  onBlur={() => saveSocial(row)}
                />
              </div>
              <div className="flex-[2]">
                <Label>URL</Label>
                <Input
                  value={row.url}
                  onChange={(e) => updateSocialLocal(row.id, { url: e.target.value })}
                  onBlur={() => saveSocial(row)}
                />
              </div>
              <Button variant="danger" onClick={() => deleteSocial(row.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
          <Button variant="ghost" onClick={addSocial}>
            <Plus size={14} />
            Add social link
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="A member of" description="Student orgs, communities, etc.">
        <div className="space-y-3">
          {orgs.map((row) => (
            <div key={row.id} className="flex flex-col sm:flex-row gap-2 sm:items-end">
              <div className="flex-1">
                <Label>Label</Label>
                <Input
                  value={row.label}
                  onChange={(e) => updateOrgLocal(row.id, { label: e.target.value })}
                  onBlur={() => saveOrg(row)}
                />
              </div>
              <div className="flex-[2]">
                <Label>URL (optional)</Label>
                <Input
                  value={row.url ?? ""}
                  onChange={(e) => updateOrgLocal(row.id, { url: e.target.value })}
                  onBlur={() => saveOrg(row)}
                />
              </div>
              <Button variant="danger" onClick={() => deleteOrg(row.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
          <Button variant="ghost" onClick={addOrg}>
            <Plus size={14} />
            Add organization
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
