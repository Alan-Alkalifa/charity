import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate, calcProgress } from "@/lib/utils";
import type { Campaign } from "@/types";

export const metadata: Metadata = { title: "Kelola Kampanye" };
export const revalidate = 30;

const MODE_LABELS = { money: "Uang", item: "Barang", both: "Keduanya" };

export default async function AdminCampaignsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  const campaigns = (data ?? []) as Campaign[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kampanye</h1>
          <p className="text-muted-foreground text-sm">{campaigns.length} total kampanye</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/campaigns/new"><Plus className="h-4 w-4 mr-1" />Buat Kampanye</Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kampanye</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Belum ada kampanye. Buat kampanye pertama Anda!
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div>
                      <Link href={`/admin/campaigns/${c.id}`} className="font-medium hover:text-primary hover:underline line-clamp-1">
                        {c.title}
                      </Link>
                      {c.category && <p className="text-xs text-muted-foreground capitalize">{c.category}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{MODE_LABELS[c.donation_mode]}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {(c.donation_mode === "money" || c.donation_mode === "both") && (
                      <div>{formatCurrency(c.current_amount)} <span className="text-muted-foreground">/ {formatCurrency(c.goal_amount)}</span></div>
                    )}
                    {(c.donation_mode === "item" || c.donation_mode === "both") && (
                      <div className="text-muted-foreground text-xs">{c.current_item_qty}/{c.goal_item_qty} item</div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {c.deadline ? formatDate(c.deadline) : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.is_active ? "success" : "secondary"}>
                      {c.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
