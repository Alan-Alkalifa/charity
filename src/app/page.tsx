import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CampaignGrid } from "@/components/campaigns/campaign-grid";
import { getCampaigns } from "@/lib/supabase/queries";
import { Heart, Package, Users, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";

export const revalidate = 60;

const STATS = [
  { label: "Donatur Bergabung", value: "2.400+", icon: Users },
  { label: "Kampanye Aktif", value: "18", icon: Heart },
  { label: "Barang Terkumpul", value: "5.000+", icon: Package },
  { label: "Dana Terhimpun", value: "Rp 1,2M", icon: TrendingUp },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Pilih Kampanye", desc: "Temukan kampanye yang ingin Anda dukung dari berbagai kategori." },
  { step: "2", title: "Pilih Cara Donasi", desc: "Donasikan uang via Midtrans, atau barang yang langsung dibutuhkan." },
  { step: "3", title: "Dampak Nyata", desc: "Pantau perkembangan kampanye dan lihat laporan transparansi kami." },
];

export default async function HomePage() {
  const featuredCampaigns = await getCampaigns({ featured: true }).catch(() => []);

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
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
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

      {/* Featured campaigns */}
      <section className="py-16 px-4">
        <div className="container mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Kampanye Unggulan</h2>
              <p className="text-muted-foreground text-sm mt-1">Kampanye yang paling membutuhkan dukungan Anda</p>
            </div>
            <Button variant="ghost" asChild className="gap-1 hidden sm:flex">
              <Link href="/campaigns">Lihat semua <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          {featuredCampaigns.length > 0 ? (
            <CampaignGrid campaigns={featuredCampaigns} />
          ) : (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground space-y-2">
              <Heart className="h-8 w-8 mx-auto text-muted-foreground/30" />
              <p>Belum ada kampanye unggulan.</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/campaigns">Lihat semua kampanye</Link>
              </Button>
            </div>
          )}

          <div className="flex justify-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/campaigns">Lihat semua kampanye</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Donation modes */}
      <section className="bg-muted/30 py-16 px-4">
        <div className="container mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl">
          <div className="rounded-xl bg-background border border-border p-6 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Donasi Uang</h3>
            <p className="text-muted-foreground text-sm">
              Bayar dengan GoPay, QRIS, transfer bank, atau kartu kredit melalui Midtrans.
              Konfirmasi instan, kwitansi otomatis via email.
            </p>
            <ul className="space-y-1.5 text-sm">
              {["Pembayaran 100% aman", "Kwitansi otomatis", "Mendukung QRIS & GoPay"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />{f}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-background border border-border p-6 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Donasi Barang</h3>
            <p className="text-muted-foreground text-sm">
              Pilih barang yang dibutuhkan, tentukan jumlah, lalu antar ke titik pengumpulan
              atau atur penjemputan oleh tim kami.
            </p>
            <ul className="space-y-1.5 text-sm">
              {["Pilih dari daftar kebutuhan", "Antar sendiri atau dijemput", "Tracking status barang"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />{f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl space-y-10">
          <h2 className="text-2xl font-bold text-center">Cara Kerja</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                  {step}
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-primary py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center space-y-5">
          <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">
            Siap Membuat Perbedaan?
          </h2>
          <p className="text-primary-foreground/80">
            Setiap donasi, sekecil apapun, membawa perubahan nyata bagi mereka yang membutuhkan.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/campaigns">Mulai Donasi Sekarang</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
