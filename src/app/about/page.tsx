import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Shield, BarChart3, Users, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "BloomInKindes adalah platform donasi berbasis komunitas yang menghubungkan donatur dengan kampanye kemanusiaan nyata di Indonesia.",
};

const VALUES = [
  {
    icon: Heart,
    title: "Empati",
    description:
      "Kami percaya setiap orang berhak mendapat bantuan yang bermartabat. Pendekatan kami selalu berpusat pada kebutuhan nyata penerima manfaat.",
  },
  {
    icon: Shield,
    title: "Integritas",
    description:
      "Setiap rupiah dan setiap item barang dipertanggungjawabkan secara penuh. Laporan distribusi tersedia untuk semua donatur.",
  },
  {
    icon: BarChart3,
    title: "Transparansi",
    description:
      "Kami mempublikasikan laporan keuangan berkala dan dokumentasi penyaluran agar donatur dapat memverifikasi dampak nyata dari kontribusinya.",
  },
  {
    icon: Users,
    title: "Komunitas",
    description:
      "BloomInKindes tumbuh bersama jaringan relawan, mitra lembaga, dan donatur yang percaya pada kekuatan kolektif untuk mengubah keadaan.",
  },
];

const MILESTONES = [
  { year: "2022", event: "BloomInKindes didirikan oleh sekelompok aktivis sosial muda di Jakarta." },
  { year: "2023", event: "Meluncurkan 12 kampanye perdana, menjangkau 2.400+ penerima manfaat di 5 provinsi." },
  { year: "2024", event: "Mengembangkan fitur donasi barang, memungkinkan penyaluran lebih dari 15.000 item kebutuhan pokok." },
  { year: "2025", event: "Meluncurkan platform digital terintegrasi dengan sistem verifikasi donatur dan pelaporan real-time." },
];

const TEAM = [
  { name: "Aisha Ramadhani", role: "Co-Founder & CEO", bio: "10+ tahun di sektor filantropi. Mantan direktur program di LSM internasional." },
  { name: "Dimas Prasetyo", role: "Co-Founder & CTO", bio: "Pengembang perangkat lunak berpengalaman dengan passion untuk teknologi sosial." },
  { name: "Siti Nurhaliza", role: "Kepala Program", bio: "Spesialis manajemen bantuan kemanusiaan, berpengalaman di respons bencana nasional." },
  { name: "Reza Firmansyah", role: "Kepala Keuangan", bio: "Akuntan publik bersertifikat dengan fokus pada pengelolaan dana nirlaba yang transparan." },
];

const PRINCIPLES = [
  "Seluruh dana yang terkumpul disalurkan 100% untuk penerima manfaat — biaya operasional kami ditanggung oleh hibah terpisah.",
  "Setiap kampanye diverifikasi tim kami sebelum dipublikasikan untuk memastikan keabsahan dan kebutuhan nyata.",
  "Laporan distribusi diunggah dalam 14 hari kerja setelah kampanye selesai.",
  "Donatur dapat meminta klarifikasi penggunaan dana kapan saja melalui email resmi kami.",
];

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="bg-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
          <h1 className="text-4xl font-bold mb-6">Tentang BloomInKindes</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Platform donasi berbasis komunitas yang menghubungkan donatur dengan kampanye kemanusiaan
            nyata di Indonesia — dengan transparansi penuh dan dampak yang terukur.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 max-w-4xl">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Misi
            </div>
            <h2 className="text-2xl font-bold">Menggerakkan kebaikan kolektif</h2>
            <p className="text-muted-foreground leading-relaxed">
              Misi kami adalah menyederhanakan proses berbagi — baik berupa uang maupun barang —
              sehingga siapa pun dapat berkontribusi secara bermakna tanpa hambatan administratif
              yang menyulitkan.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Kami hadir untuk menjembatani donatur yang ingin membantu dengan komunitas yang
              membutuhkan, didukung oleh teknologi yang andal dan tata kelola yang bertanggung jawab.
            </p>
          </div>
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Visi
            </div>
            <h2 className="text-2xl font-bold">Masyarakat saling peduli</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kami membayangkan Indonesia di mana setiap krisis kemanusiaan mendapat respons yang
              cepat dan terkoordinasi dari masyarakatnya sendiri — bukan menunggu intervensi dari
              luar, tetapi tumbuh dari dalam komunitas itu sendiri.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              BloomInKindes ingin menjadi infrastruktur kepercayaan yang memungkinkan hal itu terwujud.
            </p>
          </div>
        </div>
      </section>

      <Separator className="container mx-auto max-w-4xl" />

      {/* Values */}
      <section className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl font-bold mb-10 text-center">Nilai yang Kami Pegang</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4 rounded-xl border border-border p-5">
              <div className="mt-0.5 rounded-lg bg-primary/10 p-2.5 shrink-0 h-fit">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transparency principles */}
      <section className="bg-primary/5 border-y border-border">
        <div className="container mx-auto px-4 py-14 max-w-4xl">
          <h2 className="text-2xl font-bold mb-2">Komitmen Transparansi</h2>
          <p className="text-muted-foreground mb-8">
            Kepercayaan Anda adalah amanah. Berikut komitmen konkret yang kami pegang:
          </p>
          <ul className="space-y-4">
            {PRINCIPLES.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-muted-foreground leading-relaxed">{p}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Milestones */}
      <section className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl font-bold mb-10">Perjalanan Kami</h2>
        <div className="relative border-l-2 border-primary/30 pl-8 space-y-8">
          {MILESTONES.map(({ year, event }) => (
            <div key={year} className="relative">
              <div className="absolute -left-[2.6rem] flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold ring-4 ring-background">
                <span className="sr-only">{year}</span>
              </div>
              <p className="text-sm font-semibold text-primary mb-1">{year}</p>
              <p className="text-muted-foreground leading-relaxed">{event}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="container mx-auto max-w-4xl" />

      {/* Team */}
      <section className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl font-bold mb-2">Tim Kami</h2>
        <p className="text-muted-foreground mb-10">
          Dijalankan oleh individu yang berkomitmen penuh pada misi sosial BloomInKindes.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {TEAM.map(({ name, role, bio }) => (
            <div key={name} className="rounded-xl border border-border p-5">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg shrink-0">
                  {name[0]}
                </div>
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 max-w-4xl">
        <div className="rounded-2xl bg-primary p-10 text-center text-primary-foreground">
          <h2 className="text-2xl font-bold mb-3">Bergabunglah Bersama Kami</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Ada banyak cara untuk berkontribusi — sebagai donatur, relawan, atau mitra organisasi.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link href="/campaigns">Lihat Kampanye</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/volunteer" className="inline-flex items-center gap-2">
                Daftar Relawan <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/contact">Hubungi Kami</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
