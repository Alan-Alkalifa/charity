import type { Metadata } from "next";
import { Users, Heart, Clock } from "lucide-react";
import { VolunteerForm } from "./volunteer-form";

export const metadata: Metadata = { title: "Jadi Relawan" };

const PERKS = [
  { icon: Heart, title: "Dampak Nyata", desc: "Berkontribusi langsung dalam kampanye kemanusiaan" },
  { icon: Users, title: "Komunitas Solid", desc: "Bergabung dengan 200+ relawan aktif di seluruh Indonesia" },
  { icon: Clock, title: "Fleksibel", desc: "Pilih waktu dan keahlian yang sesuai dengan jadwal Anda" },
];

export default function VolunteerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold md:text-4xl">Jadi Bagian dari Perubahan</h1>
        <p className="text-muted-foreground text-lg">
          Bergabunglah sebagai relawan dan bantu kami menjalankan kampanye yang bermakna
          bagi mereka yang membutuhkan.
        </p>
      </div>

      {/* Perks */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PERKS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-xl border border-border p-6 space-y-3">
            <Icon className="h-6 w-6 text-primary" />
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-center">Form Pendaftaran Relawan</h2>
        <VolunteerForm />
      </div>
    </div>
  );
}
