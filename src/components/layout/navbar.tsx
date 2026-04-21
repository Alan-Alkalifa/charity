import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const NAV_LINKS = [
  { href: "/campaigns", label: "Kampanye" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/volunteer", label: "Relawan" },
  { href: "/contact", label: "Kontak" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-primary">
          <Heart className="h-5 w-5 fill-primary" />
          <span>BloomInKindes</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Masuk</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/campaigns">Donasi Sekarang</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
