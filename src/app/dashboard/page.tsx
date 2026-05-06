import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart, Package, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDonorMoneyDonations, getDonorItemPledges } from "@/lib/supabase/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/app/actions/auth";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const [moneyDonations, itemPledges] = await Promise.all([
    getDonorMoneyDonations(user.id),
    getDonorItemPledges(user.id),
  ]);

  const totalDonated = moneyDonations
    .filter((d) => d.status === "paid")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Halo, {profile?.full_name ?? user.email}!</h1>
          <p className="text-muted-foreground text-sm">Riwayat donasi dan pledge Anda</p>
        </div>
        <form action={signOut}>
          <Button variant="ghost" size="sm" type="submit" className="gap-1.5">
            <LogOut className="h-4 w-4" /> Keluar
          </Button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Donasi Uang</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-bold text-primary">{formatCurrency(totalDonated)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Jumlah Transaksi</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-bold">{moneyDonations.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pledge Barang</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-bold">{itemPledges.length}</p></CardContent>
        </Card>
      </div>

      {/* Admin link */}
      {profile?.role && ["admin", "staff"].includes(profile.role) && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
          <p className="text-sm font-medium">Anda memiliki akses admin</p>
          <Button size="sm" asChild><Link href="/admin">Buka Admin Panel</Link></Button>
        </div>
      )}

      {/* Money donations */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Riwayat Donasi Uang</h2>
        </div>
        {moneyDonations.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4">Belum ada donasi uang.</p>
        ) : (
          <div className="space-y-2">
            {moneyDonations.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <Link href={`/campaigns/${d.campaigns?.slug ?? ""}`} className="font-medium text-sm hover:text-primary hover:underline line-clamp-1">
                    {d.campaigns?.title ?? "Kampanye"}
                  </Link>
                  <p className="text-xs text-muted-foreground">{formatDate(d.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatCurrency(d.amount)}</p>
                  <Badge variant={d.status === "paid" ? "success" : d.status === "pending" ? "warning" : "destructive"} className="text-xs">
                    {d.status === "paid" ? "Dibayar" : d.status === "pending" ? "Menunggu" : "Gagal"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Item pledges */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Riwayat Pledge Barang</h2>
        </div>
        {itemPledges.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4">Belum ada pledge barang.</p>
        ) : (
          <div className="space-y-2">
            {itemPledges.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-sm">{p.campaign_items?.name ?? "Barang"}</p>
                  <Link href={`/campaigns/${p.campaigns?.slug ?? ""}`} className="text-xs text-muted-foreground hover:underline">
                    {p.campaigns?.title ?? "Kampanye"}
                  </Link>
                  <p className="text-xs text-muted-foreground">{formatDate(p.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{p.qty} item</p>
                  <Badge variant={p.status === "completed" ? "success" : p.status === "cancelled" ? "destructive" : "warning"} className="text-xs capitalize">
                    {p.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
