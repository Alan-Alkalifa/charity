import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kontak" };

export default function ContactPage() {
  return (
    <section className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Hubungi Kami</h1>
      <p className="text-muted-foreground">Form kontak akan dibangun di sini.</p>
    </section>
  );
}
