import type { Metadata } from "next";

export const metadata: Metadata = { title: "Jadi Relawan" };

export default function VolunteerPage() {
  return (
    <section className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Jadi Relawan</h1>
      <p className="text-muted-foreground mb-8">
        Bergabunglah bersama ratusan relawan aktif kami. Form pendaftaran akan tersedia segera.
      </p>
    </section>
  );
}
