"use client";

import { useTransition, useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createCollectionPoint } from "@/app/actions/campaigns";
import type { CollectionPoint } from "@/types";

interface Props {
  campaignId: string;
  points: CollectionPoint[];
}

export function CollectionPointsSection({ campaignId, points }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createCollectionPoint(campaignId, formData);
      if (res.error) { setError(res.error); }
      else { setShowForm(false); setError(null); (e.target as HTMLFormElement).reset(); }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Titik Pengumpulan ({points.length})</h2>
        <Button size="sm" variant="outline" onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Tambah Titik
        </Button>
      </div>

      {points.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada titik pengumpulan. Tambahkan lokasi tempat donatur bisa mengantar barang.</p>
      ) : (
        <div className="space-y-2">
          {points.map((pt) => (
            <div key={pt.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm">{pt.name}</p>
                <p className="text-xs text-muted-foreground">{pt.address}</p>
                {pt.open_hours && <p className="text-xs text-muted-foreground">🕒 {pt.open_hours}</p>}
                {pt.pic_name && <p className="text-xs text-muted-foreground">📞 {pt.pic_name} {pt.pic_phone}</p>}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${pt.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                {pt.is_active ? "Aktif" : "Nonaktif"}
              </span>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
          <p className="text-sm font-medium">Tambah Titik Pengumpulan</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Nama Lokasi *</Label>
              <Input name="name" placeholder="Contoh: Sekretariat Pusat" required />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Alamat Lengkap *</Label>
              <Input name="address" placeholder="Jl. Contoh No. 1, Jakarta" required />
            </div>
            <div className="space-y-1.5">
              <Label>Jam Buka</Label>
              <Input name="open_hours" placeholder="Senin–Jumat, 09–17" />
            </div>
            <div className="space-y-1.5">
              <Label>URL Google Maps</Label>
              <Input name="maps_url" type="url" placeholder="https://maps.google.com/..." />
            </div>
            <div className="space-y-1.5">
              <Label>PIC (Nama)</Label>
              <Input name="pic_name" placeholder="Nama penanggung jawab" />
            </div>
            <div className="space-y-1.5">
              <Label>PIC (Telepon)</Label>
              <Input name="pic_phone" placeholder="08xxxxxxxxxx" />
            </div>
          </div>
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isPending}>{isPending ? "Menyimpan..." : "Simpan Titik"}</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowForm(false)}>Batal</Button>
          </div>
        </form>
      )}
    </div>
  );
}
