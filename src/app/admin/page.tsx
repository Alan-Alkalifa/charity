import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default function AdminPage() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-muted-foreground">Kelola kampanye, donasi, dan relawan.</p>
    </section>
  );
}
