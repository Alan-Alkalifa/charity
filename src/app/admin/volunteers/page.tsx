import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { VolunteerStatus } from "@/types";
import { VolunteerActions } from "./volunteer-actions";

export const metadata: Metadata = { title: "Relawan" };
export const revalidate = 0;

const STATUS_VARIANT: Record<VolunteerStatus, "warning" | "success" | "outline" | "secondary"> = {
  pending: "warning",
  approved: "success",
  active: "success",
  inactive: "secondary",
};

const STATUS_LABEL: Record<VolunteerStatus, string> = {
  pending: "Pending",
  approved: "Disetujui",
  active: "Aktif",
  inactive: "Nonaktif",
};

export default async function AdminVolunteersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("volunteers")
    .select("*, profiles(full_name, phone)")
    .order("applied_at", { ascending: false });

  const volunteers = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Relawan</h1>
        <p className="text-muted-foreground text-sm">{volunteers.length} pendaftar</p>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Keahlian</TableHead>
              <TableHead>Ketersediaan</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Daftar</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volunteers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Belum ada pendaftar relawan.
                </TableCell>
              </TableRow>
            ) : (
              volunteers.map((v: any) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <p className="font-medium text-sm">{v.profiles?.full_name ?? "—"}</p>
                    {v.profiles?.phone && <p className="text-xs text-muted-foreground">{v.profiles.phone}</p>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {v.skills?.join(", ") || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{v.availability ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{v.area ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[v.status as VolunteerStatus]}>
                      {STATUS_LABEL[v.status as VolunteerStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(v.applied_at)}</TableCell>
                  <TableCell>
                    <VolunteerActions id={v.id} currentStatus={v.status} />
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
