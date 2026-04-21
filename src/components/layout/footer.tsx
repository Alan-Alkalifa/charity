import Link from "next/link";
import { Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-primary">
              <Heart className="h-5 w-5 fill-primary" />
              <span>BloomInKindes</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Bersama membangun kebaikan yang nyata dan berkelanjutan.
            </p>
          </div>

          {/* Kampanye */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Kampanye</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/campaigns" className="hover:text-foreground transition-colors">Semua Kampanye</Link></li>
              <li><Link href="/campaigns?category=pendidikan" className="hover:text-foreground transition-colors">Pendidikan</Link></li>
              <li><Link href="/campaigns?category=kesehatan" className="hover:text-foreground transition-colors">Kesehatan</Link></li>
              <li><Link href="/campaigns?category=bencana" className="hover:text-foreground transition-colors">Bencana Alam</Link></li>
            </ul>
          </div>

          {/* Organisasi */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Organisasi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">Tentang Kami</Link></li>
              <li><Link href="/volunteer" className="hover:text-foreground transition-colors">Jadi Relawan</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BloomInKindes. Hak cipta dilindungi.
          </p>
          <p className="text-xs text-muted-foreground">
            Pembayaran aman melalui Midtrans
          </p>
        </div>
      </div>
    </footer>
  );
}
