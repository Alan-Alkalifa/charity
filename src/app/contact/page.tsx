import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description: "Punya pertanyaan atau ingin berkolaborasi? Kirim pesan kepada tim BloomInKindes.",
};

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "info@bloominkindes.org",
    href: "mailto:info@bloominkindes.org",
  },
  {
    icon: Phone,
    label: "Telepon / WhatsApp",
    value: "+62 812-3456-7890",
    href: "https://wa.me/6281234567890",
  },
  {
    icon: MapPin,
    label: "Kantor",
    value: "Jl. Merdeka No. 45, Jakarta Pusat, DKI Jakarta 10110",
    href: null,
  },
  {
    icon: Clock,
    label: "Jam Operasional",
    value: "Senin–Jumat, 09.00–17.00 WIB",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Header */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Hubungi Kami</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Punya pertanyaan tentang kampanye, ingin berkolaborasi, atau membutuhkan bantuan?
          Tim kami siap membantu Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        {/* Contact info sidebar */}
        <aside className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Informasi Kontak</h2>
            <ul className="space-y-5">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-primary/10 p-2 shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-medium hover:text-primary transition-colors"
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-primary/5 border border-primary/20 p-5">
            <h3 className="font-semibold text-sm mb-2">Respons Cepat</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Untuk pertanyaan mendesak, hubungi kami langsung melalui WhatsApp.
              Kami biasanya membalas dalam 2–4 jam di hari kerja.
            </p>
          </div>
        </aside>

        {/* Form */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold mb-6">Kirim Pesan</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
