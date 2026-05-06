"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { recordManualDonation } from "@/app/actions/admin";
import type { Campaign } from "@/types";

interface Props {
  campaigns: Array<{ id: string; title: string }>;
}

export function ManualDonationForm({ campaigns }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await recordManualDonation(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess("Donasi manual berhasil dicatat");
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setSuccess(null), 3000);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="campaign">Kampanye *</Label>
          <select
            id="campaign"
            name="campaignId"
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Pilih kampanye</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="donor_name">Nama Donatur</Label>
            <Input id="donor_name" name="donor_name" placeholder="Nama (optional)" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="donor_phone">Nomor Telepon</Label>
            <Input id="donor_phone" name="donor_phone" placeholder="08xxxxxxxxxx" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="amount">Jumlah Donasi (IDR) *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min={1}
              placeholder="0"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="zakat_type">Jenis Donasi</Label>
            <select
              id="zakat_type"
              name="zakat_type"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Pilih jenis</option>
              <option value="zakat">Zakat</option>
              <option value="infaq">Infaq</option>
              <option value="sadaqah">Sadaqah</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="donated_at">Tanggal Donasi *</Label>
          <Input
            id="donated_at"
            name="donated_at"
            type="datetime-local"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="payment_proof_url">URL Bukti Pembayaran</Label>
          <Input
            id="payment_proof_url"
            name="payment_proof_url"
            type="url"
            placeholder="https://..."
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notes">Catatan</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Catatan tambahan (e.g. Bank transfer ke rekening Mandiri)"
            rows={3}
          />
        </div>
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      {success && <Alert><AlertDescription className="text-green-700">{success}</AlertDescription></Alert>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Catat Donasi Manual"}
      </Button>
    </form>
  );
}
