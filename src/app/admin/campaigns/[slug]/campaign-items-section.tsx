"use client";

import { useTransition, useState } from "react";
import { Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createCampaignItem } from "@/app/actions/campaigns";
import type { CampaignItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  campaignId: string;
  items: CampaignItem[];
}

export function CampaignItemsSection({ campaignId, items }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createCampaignItem(campaignId, formData);
      if (res.error) { setError(res.error); }
      else { setShowForm(false); setError(null); (e.target as HTMLFormElement).reset(); }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Item Barang ({items.length})</h2>
        <Button size="sm" variant="outline" onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Tambah Item
        </Button>
      </div>

      {/* Existing items */}
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada item. Tambahkan item barang yang dibutuhkan.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                  <p className="text-xs text-muted-foreground">
                    Nilai: {formatCurrency(item.unit_value)} · Target: {item.target_qty}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium">{item.pledged_qty} / {item.target_qty}</p>
                <p className="text-xs text-muted-foreground">terpledge</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
          <p className="text-sm font-medium">Tambah Item Baru</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="item_name">Nama Item *</Label>
              <Input id="item_name" name="name" placeholder="Contoh: Beras 5kg" required />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="item_desc">Deskripsi</Label>
              <Input id="item_desc" name="description" placeholder="Detail singkat" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="item_qty">Target Qty *</Label>
              <Input id="item_qty" name="target_qty" type="number" min={1} defaultValue={1} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="item_value">Nilai/item (IDR)</Label>
              <Input id="item_value" name="unit_value" type="number" min={0} defaultValue={0} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="item_img">URL Gambar</Label>
              <Input id="item_img" name="image_url" type="url" placeholder="https://..." />
            </div>
          </div>
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isPending}>{isPending ? "Menyimpan..." : "Simpan Item"}</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowForm(false)}>Batal</Button>
          </div>
        </form>
      )}
    </div>
  );
}
