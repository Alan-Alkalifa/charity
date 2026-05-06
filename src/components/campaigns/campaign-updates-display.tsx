"use client";

import { formatDate } from "@/lib/utils";
import type { CampaignUpdate } from "@/types";

interface Props {
  updates: CampaignUpdate[];
}

export function CampaignUpdatesDisplay({ updates }: Props) {
  if (updates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Update Terbaru</h2>
      <div className="space-y-3">
        {updates.map((update) => (
          <div key={update.id} className="rounded-lg border border-border p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-sm">{update.title}</h3>
              <p className="text-xs text-muted-foreground">{formatDate(update.created_at)}</p>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{update.content}</p>
            {update.image_url && (
              <img src={update.image_url} alt={update.title} className="w-full h-48 object-cover rounded-lg" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
