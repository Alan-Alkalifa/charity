import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Dashboard Donatur</h1>
      <p className="text-muted-foreground">Riwayat donasi, pledge barang, dan profil akan tampil di sini.</p>
    </section>
  );
}
