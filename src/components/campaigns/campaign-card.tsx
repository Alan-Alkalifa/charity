import Link from "next/link";
import Image from "next/image";
import { Calendar, Heart, Package, Layers } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DonationProgress } from "./donation-progress";
import { formatDate } from "@/lib/utils";
import type { CampaignWithStats } from "@/types";

const MODE_LABELS = { money: "Uang", item: "Barang", both: "Uang & Barang" } as const;
const MODE_ICONS = { money: Heart, item: Package, both: Layers } as const;

interface Props {
  campaign: CampaignWithStats;
}

export function CampaignCard({ campaign }: Props) {
  const ModeIcon = MODE_ICONS[campaign.donation_mode];
  const isExpired = campaign.deadline ? new Date(campaign.deadline) < new Date() : false;

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      {/* Cover image */}
      <div className="relative h-48 w-full bg-muted">
        {campaign.cover_image_url ? (
          <Image
            src={campaign.cover_image_url}
            alt={campaign.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Heart className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        {campaign.is_featured && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            Unggulan
          </span>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 pt-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {campaign.category && (
            <Badge variant="secondary" className="capitalize">{campaign.category}</Badge>
          )}
          <Badge variant="outline" className="gap-1">
            <ModeIcon className="h-3 w-3" />
            {MODE_LABELS[campaign.donation_mode]}
          </Badge>
          {campaign.zakat_type && (
            <Badge variant="success" className="capitalize">{campaign.zakat_type}</Badge>
          )}
          {isExpired && <Badge variant="destructive">Berakhir</Badge>}
        </div>

        {/* Title + description */}
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold leading-tight line-clamp-2">{campaign.title}</h3>
          {campaign.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
          )}
        </div>

        {/* Progress */}
        <DonationProgress
          donationMode={campaign.donation_mode}
          currentAmount={campaign.current_amount}
          goalAmount={campaign.goal_amount}
          moneyProgress={campaign.money_progress}
          currentItemQty={campaign.current_item_qty}
          goalItemQty={campaign.goal_item_qty}
          itemProgress={campaign.item_progress}
        />

        {/* Deadline */}
        {campaign.deadline && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Berakhir {formatDate(campaign.deadline)}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button className="w-full" asChild>
          <Link href={`/campaigns/${campaign.slug}`}>Donasi Sekarang</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
