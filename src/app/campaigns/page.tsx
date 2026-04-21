import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kampanye" };

export default function CampaignsPage() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Semua Kampanye</h1>
      <p className="text-muted-foreground">Kampanye akan ditampilkan di sini setelah integrasi Supabase selesai.</p>
    </section>
  );
}
