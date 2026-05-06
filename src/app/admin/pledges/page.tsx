import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { PledgeStatus } from "@/types";

export const metadata: Metadata = { title: "Pledge Barang" };
export const revalidate = 30;

const STATUS_VARIANT: Record<PledgeStatus, "success" | "warning" | "secondary" | "outline" | "destructive"> = {
  pledged: "warning",
  confirmed: "secondary",
  received: "outline",
  completed: "success",
  cancelled: "destructive",
};

const STATUS_LABEL: Record<PledgeStatus, string> = {
  pledged: "Dijanjikan",
  confirmed: "Dikonfirmasi",
  received: "Diterima",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export default async function AdminPledgesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("item_pledges")
    .select("*, campaigns(title), campaign_items(name)")
    .order("created_at", { ascending: false })
    .limit(200);

  const pledges = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pledge Barang</h1>
        <p className="text-muted-foreground text-sm">{pledges.length} pledge terbaru</p>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donatur</TableHead>
              <TableHead>Barang</TableHead>
              <TableHead>Kampanye</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Metode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pledges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Belum ada pledge barang.
                </TableCell>
              </TableRow>
            ) : (
              pledges.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <p className="font-medium text-sm">{p.donor_name ?? "—"}</p>
                    {p.donor_phone && <p className="text-xs text-muted-foreground">{p.donor_phone}</p>}
                  </TableCell>
                  <TableCell className="text-sm">{p.campaign_items?.name ?? "—"}</TableCell>
                  <TableCell className="text-sm line-clamp-1">{p.campaigns?.title ?? "—"}</TableCell>
                  <TableCell className="font-medium">{p.qty}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">
                      {p.fulfillment_method === "dropoff" ? "Antar" : "Jemput"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[p.status as PledgeStatus]}>
                      {STATUS_LABEL[p.status as PledgeStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(p.created_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
