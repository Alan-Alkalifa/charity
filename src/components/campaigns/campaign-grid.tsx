import { CampaignCard } from "./campaign-card";
import type { CampaignWithStats } from "@/types";

interface Props {
  campaigns: CampaignWithStats[];
}

export function CampaignGrid({ campaigns }: Props) {
  if (campaigns.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        <p className="text-lg font-medium">Belum ada kampanye aktif</p>
        <p className="text-sm mt-1">Coba ubah filter atau kunjungi kembali nanti.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((c) => (
        <CampaignCard key={c.id} campaign={c} />
      ))}
    </div>
  );
}
