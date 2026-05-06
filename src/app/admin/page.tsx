import type { Metadata } from "next";
import { TrendingUp, Megaphone, Package, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminStats } from "@/lib/supabase/queries";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin Dashboard" };
export const revalidate = 60;

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const CARDS = [
    { label: "Kampanye Aktif", value: stats.activeCampaigns, icon: Megaphone, color: "text-blue-500" },
    { label: "Dana Terhimpun", value: formatCurrency(stats.totalRaised), icon: TrendingUp, color: "text-primary" },
    { label: "Barang Terkumpul", value: `${stats.totalItems} item`, icon: Package, color: "text-amber-500" },
    { label: "Relawan Pending", value: stats.pendingVolunteers, icon: Users, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Ringkasan aktivitas platform BloomInKindes</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Aksi Cepat</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <a href="/admin/campaigns" className="flex items-center gap-2 text-primary hover:underline"><Megaphone className="h-4 w-4" /> Kelola Kampanye</a>
            <a href="/admin/donations" className="flex items-center gap-2 text-primary hover:underline"><TrendingUp className="h-4 w-4" /> Lihat Donasi Masuk</a>
            <a href="/admin/pledges" className="flex items-center gap-2 text-primary hover:underline"><Package className="h-4 w-4" /> Verifikasi Pledge Barang</a>
            <a href="/admin/volunteers" className="flex items-center gap-2 text-primary hover:underline"><Users className="h-4 w-4" /> Approve Relawan</a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
