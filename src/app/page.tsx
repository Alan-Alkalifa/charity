import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Package, Users, TrendingUp } from "lucide-react";

const STATS = [
  { label: "Donatur", value: "2.400+", icon: Users },
  { label: "Kampanye Aktif", value: "18", icon: Heart },
  { label: "Barang Terkumpul", value: "5.000+", icon: Package },
  { label: "Dana Terhimpun", value: "Rp 1,2M", icon: TrendingUp },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Platform Donasi Terpercaya
          </span>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Kebaikan Kecil,{" "}
            <span className="text-primary">Dampak Besar</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Donasikan uang atau barang untuk kampanye yang nyata dan terverifikasi.
            Transparansi penuh, dampak terukur.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/campaigns">Lihat Kampanye</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/volunteer">Jadi Relawan</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/30 py-12 px-4">
        <div className="container mx-auto grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <Icon className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold">{value}</span>
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured campaigns placeholder */}
      <section className="py-16 px-4">
        <div className="container mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Kampanye Unggulan</h2>
            <Button variant="ghost" asChild>
              <Link href="/campaigns">Lihat semua →</Link>
            </Button>
          </div>
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Kampanye akan tampil di sini setelah terhubung ke Supabase.
          </div>
        </div>
      </section>

      {/* Donation modes explainer */}
      <section className="bg-muted/30 py-16 px-4">
        <div className="container mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Donasi Uang</h3>
            <p className="text-muted-foreground">
              Bayar dengan GoPay, QRIS, transfer bank, atau kartu kredit melalui Midtrans.
              Konfirmasi instan, kwitansi otomatis via email.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Donasi Barang</h3>
            <p className="text-muted-foreground">
              Pilih barang yang dibutuhkan, tentukan jumlah, lalu antar ke titik pengumpulan
              atau atur penjemputan. Transparansi penuh di setiap langkah.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
