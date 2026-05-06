"use client";

import { useTransition, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createCampaignUpdate } from "@/app/actions/campaigns";
import { deleteCampaignUpdate } from "@/app/actions/admin";
import type { CampaignUpdate } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props {
  campaignId: string;
  updates: CampaignUpdate[];
}

export function CampaignUpdatesSection({ campaignId, updates }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = (updateId: string) => {
    if (!confirm("Hapus update ini?")) return;
    setDeletingId(updateId);
    startTransition(async () => {
      await deleteCampaignUpdate(updateId);
      setDeletingId(null);
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createCampaignUpdate(campaignId, formData);
      if (res.error) {
        setError(res.error);
      } else {
        setShowForm(false);
        setError(null);
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Update Kampanye ({updates.length})</h2>
        <Button size="sm" variant="outline" onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Tambah Update
        </Button>
      </div>

      {updates.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada update. Bagikan perkembangan kampanye kepada donatur.</p>
      ) : (
        <div className="space-y-3">
          {updates.map((update) => (
            <div key={update.id} className="rounded-lg border border-border p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{update.title}</h3>
                  <p className="text-xs text-muted-foreground">{formatDate(update.created_at)}</p>
                </div>
                <button
                  onClick={() => handleDelete(update.id)}
                  disabled={deletingId === update.id}
                  className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                  title="Hapus update"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">{update.content}</p>
              {update.image_url && (
                <img src={update.image_url} alt={update.title} className="h-32 w-full object-cover rounded" />
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
          <p className="text-sm font-medium">Tambah Update Baru</p>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Judul Update *</Label>
              <Input name="title" placeholder="Contoh: Pengumpulan telah mencapai 50%" required />
            </div>
            <div className="space-y-1.5">
              <Label>Konten *</Label>
              <Textarea name="content" placeholder="Ceritakan perkembangan kampanye..." rows={4} required />
            </div>
            <div className="space-y-1.5">
              <Label>URL Gambar</Label>
              <Input name="image_url" type="url" placeholder="https://..." />
            </div>
          </div>
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isPending}>{isPending ? "Menyimpan..." : "Simpan Update"}</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowForm(false)}>Batal</Button>
          </div>
        </form>
      )}
    </div>
  );
}
