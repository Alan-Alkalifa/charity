"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatCurrency } from "@/lib/utils";
import type { Campaign } from "@/types";

const PRESETS = [25_000, 50_000, 100_000, 250_000, 500_000];

const schema = z.object({
  donor_name: z.string().min(2, "Minimal 2 karakter"),
  donor_email: z.string().email("Email tidak valid").or(z.literal("")).optional(),
  donor_phone: z.string().optional(),
  amount: z.number().min(5_000, "Minimal Rp 5.000"),
  zakat_type: z.enum(["zakat", "infaq", "sadaqah"]).optional(),
  is_anonymous: z.boolean(),
  on_behalf_of: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  campaign: Campaign;
}

export function MoneyDonationForm({ campaign }: Props) {
  const [customAmount, setCustomAmount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 50_000, is_anonymous: false },
  });

  const isAnonymous = watch("is_anonymous");
  const selectedAmount = watch("amount");

  const pickPreset = (val: number) => {
    setValue("amount", val);
    setCustomAmount(false);
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/donations/money", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, campaign_id: campaign.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal memproses donasi");

      // Open Midtrans Snap
      if (typeof window !== "undefined" && window.snap) {
        window.snap.pay(data.token, {
          onSuccess: () => { window.location.href = `/campaigns/${campaign.slug}/donate/success`; },
          onPending: () => { window.location.href = `/campaigns/${campaign.slug}/donate/success`; },
          onError: () => setError("Pembayaran gagal. Silakan coba lagi."),
          onClose: () => setLoading(false),
        });
      } else {
        setError("Midtrans Snap belum dimuat. Muat ulang halaman.");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Amount presets */}
      <div className="space-y-2">
        <Label>Jumlah Donasi</Label>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => pickPreset(p)}
              className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                !customAmount && selectedAmount === p
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary hover:text-primary"
              }`}
            >
              {formatCurrency(p)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => { setCustomAmount(true); setValue("amount", 0); }}
            className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors col-span-3 ${
              customAmount
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary hover:text-primary"
            }`}
          >
            Nominal Lain
          </button>
        </div>
        {customAmount && (
          <Input
            type="number"
            placeholder="Masukkan nominal (min. Rp 5.000)"
            {...register("amount")}
            className="mt-2"
          />
        )}
        {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
      </div>

      {/* Zakat type */}
      {campaign.zakat_type && (
        <div className="space-y-1.5">
          <Label>Jenis Donasi</Label>
          <select
            {...register("zakat_type")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Pilih jenis</option>
            <option value="zakat">Zakat</option>
            <option value="infaq">Infaq</option>
            <option value="sadaqah">Sedekah</option>
          </select>
        </div>
      )}

      {/* Donor info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="anon" {...register("is_anonymous")} className="h-4 w-4 rounded border-border" />
          <Label htmlFor="anon">Donasi sebagai anonim</Label>
        </div>

        {!isAnonymous && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="donor_name">Nama Lengkap *</Label>
              <Input id="donor_name" placeholder="Nama Anda" {...register("donor_name")} />
              {errors.donor_name && <p className="text-xs text-destructive">{errors.donor_name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="donor_email">Email (untuk kwitansi)</Label>
              <Input id="donor_email" type="email" placeholder="email@anda.com" {...register("donor_email")} />
              {errors.donor_email && <p className="text-xs text-destructive">{errors.donor_email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="donor_phone">No. Telepon</Label>
              <Input id="donor_phone" placeholder="08xxxxxxxxxx" {...register("donor_phone")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="on_behalf_of">Atas nama (opsional)</Label>
              <Input id="on_behalf_of" placeholder="Untuk hadiah / in memoriam" {...register("on_behalf_of")} />
            </div>
          </>
        )}

        {isAnonymous && (
          <div className="space-y-1.5">
            <Label htmlFor="donor_name_anon">Nama (tetap dibutuhkan untuk kwitansi)</Label>
            <Input id="donor_name_anon" placeholder="Nama Anda" {...register("donor_name")} />
            {errors.donor_name && <p className="text-xs text-destructive">{errors.donor_name.message}</p>}
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Memproses..." : `Donasi ${formatCurrency(selectedAmount || 0)}`}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Pembayaran aman melalui Midtrans · GoPay, QRIS, Transfer Bank, Kartu Kredit
      </p>
    </form>
  );
}
