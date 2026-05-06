"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Minus, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { CampaignItem, CollectionPoint } from "@/types";

const schema = z.object({
  donor_name: z.string().min(2, "Minimal 2 karakter"),
  donor_email: z.string().email("Email tidak valid").or(z.literal("")).optional(),
  donor_phone: z.string().optional(),
  fulfillment_method: z.enum(["dropoff", "pickup"]),
  collection_point_id: z.string().optional(),
  donor_address: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({ campaign_item_id: z.string(), qty: z.number().min(0) })),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  campaignId: string;
  items: CampaignItem[];
  collectionPoints: CollectionPoint[];
}

export function ItemPledgeForm({ campaignId, items, collectionPoints }: Props) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fulfillment_method: "dropoff",
      items: items.map((i) => ({ campaign_item_id: i.id, qty: 0 })),
    },
  });

  const fulfillment = watch("fulfillment_method");
  const watchedItems = watch("items");
  const totalSelected = watchedItems?.reduce((s, i) => s + (Number(i.qty) || 0), 0) ?? 0;

  const adjustQty = (index: number, delta: number) => {
    const current = Number(watchedItems?.[index]?.qty) || 0;
    const item = items[index];
    const available = item.target_qty - item.pledged_qty;
    const next = Math.max(0, Math.min(current + delta, available));
    setValue(`items.${index}.qty`, next);
  };

  const onSubmit = async (values: FormValues) => {
    const selectedItems = values.items.filter((i) => Number(i.qty) > 0);
    if (selectedItems.length === 0) {
      setError("Pilih minimal satu barang");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/donations/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, campaign_id: campaignId, items: selectedItems }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan pledge");
      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Alert variant="success">
        <Package className="h-4 w-4" />
        <AlertTitle>Pledge Berhasil Dicatat!</AlertTitle>
        <AlertDescription>
          Terima kasih! Tim kami akan menghubungi Anda untuk konfirmasi pengiriman barang.
          Silakan cek email Anda untuk detail lebih lanjut.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Item list */}
      <div className="space-y-3">
        <Label>Pilih Barang yang Akan Didonasikan</Label>
        {items.map((item, index) => {
          const available = item.target_qty - item.pledged_qty;
          const currentQty = Number(watchedItems?.[index]?.qty) || 0;
          return (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                {item.description && (
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sisa: {available} dari {item.target_qty}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => adjustQty(index, -1)}
                  disabled={currentQty === 0}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-muted disabled:opacity-40"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-medium">{currentQty}</span>
                <button
                  type="button"
                  onClick={() => adjustQty(index, 1)}
                  disabled={currentQty >= available}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-muted disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <input type="hidden" {...register(`items.${index}.qty`)} />
              <input type="hidden" {...register(`items.${index}.campaign_item_id`)} />
            </div>
          );
        })}
        {totalSelected === 0 && error === "Pilih minimal satu barang" && (
          <p className="text-xs text-destructive">Pilih minimal satu barang</p>
        )}
      </div>

      {/* Donor info */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="item_donor_name">Nama Lengkap *</Label>
          <Input id="item_donor_name" placeholder="Nama Anda" {...register("donor_name")} />
          {errors.donor_name && <p className="text-xs text-destructive">{errors.donor_name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="item_donor_email">Email</Label>
          <Input id="item_donor_email" type="email" placeholder="email@anda.com" {...register("donor_email")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="item_donor_phone">No. Telepon</Label>
          <Input id="item_donor_phone" placeholder="08xxxxxxxxxx" {...register("donor_phone")} />
        </div>
      </div>

      {/* Fulfillment */}
      <div className="space-y-2">
        <Label>Metode Pengiriman</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "dropoff", label: "Antar Sendiri", desc: "Ke titik pengumpulan" },
            { value: "pickup", label: "Dijemput", desc: "Tim kami yang datang" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                fulfillment === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <input type="radio" value={opt.value} {...register("fulfillment_method")} className="sr-only" />
              <p className="font-medium text-sm">{opt.label}</p>
              <p className="text-xs text-muted-foreground">{opt.desc}</p>
            </label>
          ))}
        </div>

        {fulfillment === "dropoff" && collectionPoints.length > 0 && (
          <div className="space-y-1.5 mt-2">
            <Label>Titik Pengumpulan</Label>
            <select
              {...register("collection_point_id")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Pilih titik pengumpulan</option>
              {collectionPoints.map((cp) => (
                <option key={cp.id} value={cp.id}>
                  {cp.name} — {cp.address}
                </option>
              ))}
            </select>
          </div>
        )}

        {fulfillment === "pickup" && (
          <div className="space-y-1.5 mt-2">
            <Label>Alamat Penjemputan</Label>
            <Input placeholder="Alamat lengkap Anda" {...register("donor_address")} />
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="item_notes">Catatan (opsional)</Label>
        <Input id="item_notes" placeholder="Kondisi barang, catatan khusus, dll." {...register("notes")} />
      </div>

      {error && error !== "Pilih minimal satu barang" && (
        <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading || totalSelected === 0}>
        {loading ? "Menyimpan..." : `Konfirmasi Pledge (${totalSelected} barang)`}
      </Button>
    </form>
  );
}
