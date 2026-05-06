import type { Metadata } from "next";
import { CampaignForm } from "../campaign-form";

export const metadata: Metadata = { title: "Buat Kampanye Baru" };

export default function NewCampaignPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Buat Kampanye Baru</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Isi detail kampanye. Setelah dibuat, Anda bisa menambahkan item barang dan titik pengumpulan.
        </p>
      </div>
      <CampaignForm />
    </div>
  );
}
