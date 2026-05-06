import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { DonationStatus } from "@/types";
import { ManualDonationForm } from "./manual-donation-form";

export const metadata: Metadata = { title: "Donasi" };
export const revalidate = 0;

const STATUS_VARIANT: Record<DonationStatus, "success" | "warning" | "destructive" | "secondary" | "outline"> = {
  paid: "success",
  pending: "warning",
  failed: "destructive",
  expired: "secondary",
  refunded: "outline",
};

const STATUS_LABEL: Record<DonationStatus, string> = {
  paid: "Dibayar",
  pending: "Menunggu",
  failed: "Gagal",
  expired: "Kedaluwarsa",
  refunded: "Dikembalikan",
};

export default async function AdminDonationsPage() {
  const supabase = await createClient();
  const [{ data: donations }, { data: campaigns }] = await Promise.all([
    supabase
      .from("money_donations")
      .select("*, campaigns(title)")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("campaigns")
      .select("id, title")
      .eq("is_active", true)
      .order("title"),
  ]);

  const moneyDonations = donations ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Donasi</h1>
        <p className="text-muted-foreground text-sm">{moneyDonations.length} transaksi uang tercatat</p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Daftar Donasi</TabsTrigger>
          <TabsTrigger value="manual">Catat Donasi Manual</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donatur</TableHead>
                  <TableHead>Kampanye</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moneyDonations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Belum ada donasi masuk.
                    </TableCell>
                  </TableRow>
                ) : (
                  moneyDonations.map((d: any) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{d.is_anonymous ? "Anonim" : (d.donor_name ?? "—")}</p>
                      {d.donor_email && <p className="text-xs text-muted-foreground">{d.donor_email}</p>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm line-clamp-1">{d.campaigns?.title ?? "—"}</TableCell>
                  <TableCell className="font-medium text-sm">{formatCurrency(d.amount)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground capitalize">{d.payment_method ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[d.status as DonationStatus]}>
                      {STATUS_LABEL[d.status as DonationStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(d.created_at)}
                  </TableCell>
                </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 mb-6">
            <p className="text-sm font-medium">Catat Donasi Manual</p>
            <p className="text-xs text-muted-foreground">
              Gunakan form ini untuk mencatat donasi offline (transfer bank, cash, dll) yang sudah diterima atau disetujui.
            </p>
          </div>
          <ManualDonationForm campaigns={campaigns ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
