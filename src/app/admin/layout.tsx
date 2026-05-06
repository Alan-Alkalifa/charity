import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Megaphone, Wallet, Users, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Separator } from "@/components/ui/separator";

const NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "Ringkasan" },
  { href: "/admin/campaigns", icon: Megaphone, label: "Kampanye" },
  { href: "/admin/donations", icon: Wallet, label: "Donasi Uang" },
  { href: "/admin/pledges", icon: Package, label: "Pledge Barang" },
  { href: "/admin/volunteers", icon: Users, label: "Relawan" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "staff"].includes(profile.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-background hidden md:flex flex-col py-6 px-3 gap-1">
        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Admin
        </p>
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
        <Separator className="mt-auto mb-2" />
        <Link href="/dashboard" className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
          ← Keluar Admin
        </Link>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
    </div>
  );
}
