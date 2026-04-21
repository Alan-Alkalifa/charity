import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tentang Kami" };

export default function AboutPage() {
  return (
    <section className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Tentang BloomInKindes</h1>
      <p className="text-muted-foreground leading-relaxed">
        BloomInKindes adalah platform donasi berbasis komunitas yang menghubungkan donatur dengan
        kampanye kemanusiaan nyata. Kami mendukung donasi berupa uang maupun barang dengan
        transparansi penuh dan pelaporan berkala.
      </p>
    </section>
  );
}
