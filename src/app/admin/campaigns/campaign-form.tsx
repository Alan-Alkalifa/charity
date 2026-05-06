"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { slugify } from "@/lib/utils";
import { createCampaign, updateCampaign } from "@/app/actions/campaigns";
import type { Campaign } from "@/types";

const CATEGORIES = ["pendidikan", "kesehatan", "bencana", "lingkungan", "sosial", "lainnya"];

interface Props {
  campaign?: Campaign;
}

export function CampaignForm({ campaign }: Props) {
  const isEdit = Boolean(campaign);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ error?: string; success?: string } | null>(null);
  const [slug, setSlug] = useState(campaign?.slug ?? "");
  const [mode, setMode] = useState<"money" | "item" | "both">(campaign?.donation_mode ?? "money");
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const titleRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!slugEdited) setSlug(slugify(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("slug", slug);
    startTransition(async () => {
      const res = isEdit
        ? await updateCampaign(campaign!.slug, formData)
        : await createCampaign(formData);
      if (res && "error" in res) setResult({ error: res.error });
      else if (res && "success" in res) setResult({ success: res.success });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Basic info */}
      <div className="space-y-5">
        <h2 className="text-base font-semibold">Informasi Dasar</h2>

        <div className="space-y-1.5">
          <Label htmlFor="title">Judul Kampanye *</Label>
          <Input
            id="title"
            name="title"
            ref={titleRef}
            defaultValue={campaign?.title}
            onChange={handleTitleChange}
            placeholder="Judul yang menarik dan jelas"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug (URL)</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground shrink-0">/campaigns/</span>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
              placeholder="slug-kampanye"
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">Otomatis dari judul. Hanya huruf, angka, dan tanda hubung.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Deskripsi Singkat</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={campaign?.description ?? ""}
            placeholder="1–2 kalimat tentang kampanye ini"
            rows={3}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="content">Konten Lengkap (HTML/teks)</Label>
          <Textarea
            id="content"
            name="content"
            defaultValue={campaign?.content ?? ""}
            placeholder="Ceritakan detail kampanye, latar belakang, dan kebutuhan secara lengkap..."
            rows={8}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cover_image_url">URL Gambar Cover</Label>
          <Input
            id="cover_image_url"
            name="cover_image_url"
            type="url"
            defaultValue={campaign?.cover_image_url ?? ""}
            placeholder="https://..."
          />
          <p className="text-xs text-muted-foreground">Gunakan link gambar publik. Upload ke Supabase Storage untuk hosting sendiri.</p>
        </div>
      </div>

      <Separator />

      {/* Category + zakat */}
      <div className="space-y-5">
        <h2 className="text-base font-semibold">Kategori & Jenis</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="category">Kategori</Label>
            <select
              id="category"
              name="category"
              defaultValue={campaign?.category ?? ""}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Pilih kategori</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="capitalize">{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="zakat_type">Jenis Zakat/Infaq</Label>
            <select
              id="zakat_type"
              name="zakat_type"
              defaultValue={campaign?.zakat_type ?? ""}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Tidak ada</option>
              <option value="zakat">Zakat</option>
              <option value="infaq">Infaq</option>
              <option value="sadaqah">Sedekah</option>
            </select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Donation mode */}
      <div className="space-y-5">
        <h2 className="text-base font-semibold">Mode Donasi</h2>
        <p className="text-sm text-muted-foreground -mt-3">
          Tentukan apakah kampanye ini menerima donasi uang, barang, atau keduanya.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {(["money", "item", "both"] as const).map((m) => (
            <label
              key={m}
              className={`cursor-pointer rounded-lg border p-3 text-center transition-colors ${
                mode === m ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="radio"
                name="donation_mode"
                value={m}
                checked={mode === m}
                onChange={() => setMode(m)}
                className="sr-only"
              />
              <p className="font-medium text-sm">
                {m === "money" ? "Uang" : m === "item" ? "Barang" : "Keduanya"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {m === "money" ? "Midtrans" : m === "item" ? "Pledge" : "Uang + Barang"}
              </p>
            </label>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {(mode === "money" || mode === "both") && (
            <div className="space-y-1.5">
              <Label htmlFor="goal_amount">Target Dana (IDR)</Label>
              <Input
                id="goal_amount"
                name="goal_amount"
                type="number"
                min={0}
                step={1000}
                defaultValue={campaign?.goal_amount ?? 0}
                placeholder="0"
              />
            </div>
          )}
          {(mode === "item" || mode === "both") && (
            <div className="space-y-1.5">
              <Label htmlFor="goal_item_qty">Target Jumlah Barang</Label>
              <Input
                id="goal_item_qty"
                name="goal_item_qty"
                type="number"
                min={0}
                defaultValue={campaign?.goal_item_qty ?? 0}
                placeholder="0"
              />
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Settings */}
      <div className="space-y-5">
        <h2 className="text-base font-semibold">Pengaturan</h2>

        <div className="space-y-1.5">
          <Label htmlFor="deadline">Batas Waktu</Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            defaultValue={campaign?.deadline ?? ""}
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={campaign?.is_active ?? true}
              className="h-4 w-4 rounded border-border"
            />
            <div>
              <p className="text-sm font-medium">Kampanye Aktif</p>
              <p className="text-xs text-muted-foreground">Kampanye tampil dan bisa menerima donasi</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={campaign?.is_featured ?? false}
              className="h-4 w-4 rounded border-border"
            />
            <div>
              <p className="text-sm font-medium">Kampanye Unggulan</p>
              <p className="text-xs text-muted-foreground">Tampil di halaman utama</p>
            </div>
          </label>
        </div>
      </div>

      {result?.error && (
        <Alert variant="destructive"><AlertDescription>{result.error}</AlertDescription></Alert>
      )}
      {result?.success && (
        <Alert variant="success"><AlertDescription>{result.success}</AlertDescription></Alert>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Kampanye"}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Batal
        </Button>
      </div>
    </form>
  );
}
