"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const NAV_LINKS = [
  { href: "/campaigns", label: "Kampanye" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/volunteer", label: "Relawan" },
  { href: "/contact", label: "Kontak" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-primary">
            <Heart className="h-5 w-5 fill-primary" />
            <span>BloomInKindes</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-foreground ${
                  pathname.startsWith(link.href) ? "text-foreground font-semibold" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/campaigns">Donasi Sekarang</Link>
            </Button>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" aria-modal="true">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Drawer panel */}
          <div className="absolute left-0 right-0 top-16 bottom-0 bg-background border-t border-border flex flex-col px-4 py-6 gap-2 overflow-y-auto">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center h-12 rounded-md px-3 text-base font-medium transition-colors hover:bg-muted ${
                  pathname.startsWith(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Separator className="my-3" />
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button className="w-full" asChild>
              <Link href="/campaigns">Donasi Sekarang</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
