import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCampaignItems, getCollectionPoints } from "@/lib/supabase/queries";
import { CampaignForm } from "../campaign-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { CampaignItemsSection } from "./campaign-items-section";
import { CollectionPointsSection } from "./collection-points-section";
import type { Campaign } from "@/types";

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Edit: ${slug}` };
}

export default async function AdminCampaignEditPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("campaigns")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) notFound();
  const campaign = data as Campaign;

  const [items, points] = await Promise.all([
    getCampaignItems(campaign.id),
    getCollectionPoints(campaign.id),
  ]);

  const showItems = campaign.donation_mode === "item" || campaign.donation_mode === "both";

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold line-clamp-1">{campaign.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={campaign.is_active ? "success" : "secondary"}>
              {campaign.is_active ? "Aktif" : "Nonaktif"}
            </Badge>
            {campaign.is_featured && <Badge>Unggulan</Badge>}
            <Badge variant="outline" className="capitalize">{campaign.donation_mode}</Badge>
          </div>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link href={`/campaigns/${campaign.slug}`} target="_blank" className="gap-1.5">
            <ExternalLink className="h-3.5 w-3.5" /> Lihat Publik
          </Link>
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(campaign.donation_mode === "money" || campaign.donation_mode === "both") && (
          <>
            <Card>
              <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground">Terkumpul</CardTitle></CardHeader>
              <CardContent><p className="font-bold">{formatCurrency(campaign.current_amount)}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground">Target Dana</CardTitle></CardHeader>
              <CardContent><p className="font-bold">{formatCurrency(campaign.goal_amount)}</p></CardContent>
            </Card>
          </>
        )}
        {showItems && (
          <>
            <Card>
              <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground">Barang Terkumpul</CardTitle></CardHeader>
              <CardContent><p className="font-bold">{campaign.current_item_qty} item</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground">Target Barang</CardTitle></CardHeader>
              <CardContent><p className="font-bold">{campaign.goal_item_qty} item</p></CardContent>
            </Card>
          </>
        )}
      </div>

      <Separator />

      {/* Edit form */}
      <div>
        <h2 className="text-lg font-semibold mb-6">Edit Kampanye</h2>
        <CampaignForm campaign={campaign} />
      </div>

      {/* Campaign items */}
      {showItems && (
        <>
          <Separator />
          <CampaignItemsSection campaignId={campaign.id} items={items} />
        </>
      )}

      {/* Collection points */}
      {showItems && (
        <>
          <Separator />
          <CollectionPointsSection campaignId={campaign.id} points={points} />
        </>
      )}
    </div>
  );
}
