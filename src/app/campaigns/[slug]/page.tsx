import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import { Calendar, MapPin, Heart, Package, Layers } from "lucide-react";
import { getCampaignBySlug, getCampaignItems, getCollectionPoints } from "@/lib/supabase/queries";
import { DonationProgress } from "@/components/campaigns/donation-progress";
import { MoneyDonationForm } from "@/components/donations/money-donation-form";
import { ItemPledgeForm } from "@/components/donations/item-pledge-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";

export const revalidate = 30;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) return { title: "Kampanye tidak ditemukan" };
  return {
    title: campaign.title,
    description: campaign.description ?? undefined,
    openGraph: { images: campaign.cover_image_url ? [campaign.cover_image_url] : [] },
  };
}

export default async function CampaignDetailPage({ params }: Props) {
  const { slug } = await params;

  const [campaign, items, collectionPoints] = await Promise.all([
    getCampaignBySlug(slug),
    (async () => null)(), // placeholder — fetched below after campaign check
    (async () => null)(),
  ]);

  if (!campaign) notFound();

  const [campaignItems, points] = await Promise.all([
    getCampaignItems(campaign.id),
    getCollectionPoints(campaign.id),
  ]);

  const MODE_ICON = { money: Heart, item: Package, both: Layers }[campaign.donation_mode];
  const MODE_LABEL = { money: "Donasi Uang", item: "Donasi Barang", both: "Uang & Barang" }[campaign.donation_mode];
  const isExpired = campaign.deadline ? new Date(campaign.deadline) < new Date() : false;

  const snapUrl = process.env.MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

  return (
    <>
      <Script
        src={snapUrl}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left — campaign info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
              {campaign.cover_image_url ? (
                <Image
                  src={campaign.cover_image_url}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 67vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Heart className="h-20 w-20 text-muted-foreground/20" />
                </div>
              )}
            </div>

            {/* Title + badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {campaign.category && (
                  <Badge variant="secondary" className="capitalize">{campaign.category}</Badge>
                )}
                <Badge variant="outline" className="gap-1">
                  <MODE_ICON className="h-3 w-3" />{MODE_LABEL}
                </Badge>
                {campaign.zakat_type && (
                  <Badge variant="success" className="capitalize">{campaign.zakat_type}</Badge>
                )}
                {isExpired && <Badge variant="destructive">Kampanye Berakhir</Badge>}
                {campaign.is_featured && <Badge>Unggulan</Badge>}
              </div>
              <h1 className="text-2xl font-bold leading-tight md:text-3xl">{campaign.title}</h1>
              {campaign.description && (
                <p className="text-muted-foreground">{campaign.description}</p>
              )}
            </div>

            <Separator />

            {/* Content */}
            {campaign.content && (
              <div
                className="prose prose-sm max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: campaign.content }}
              />
            )}

            {/* Collection points for item campaigns */}
            {(campaign.donation_mode === "item" || campaign.donation_mode === "both") && points.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">Titik Pengumpulan Barang</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {points.map((pt) => (
                    <Card key={pt.id}>
                      <CardContent className="pt-4 space-y-1">
                        <p className="font-medium">{pt.name}</p>
                        <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                          <span>{pt.address}</span>
                        </div>
                        {pt.open_hours && (
                          <p className="text-xs text-muted-foreground">🕒 {pt.open_hours}</p>
                        )}
                        {pt.pic_name && (
                          <p className="text-xs text-muted-foreground">📞 {pt.pic_name}{pt.pic_phone ? ` · ${pt.pic_phone}` : ""}</p>
                        )}
                        {pt.maps_url && (
                          <a href={pt.maps_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                            Lihat di Maps →
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — donation panel */}
          <div className="space-y-4">
            <Card className="sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {campaign.deadline && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-normal mb-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Berakhir {formatDate(campaign.deadline)}</span>
                    </div>
                  )}
                  <DonationProgress
                    donationMode={campaign.donation_mode}
                    currentAmount={campaign.current_amount}
                    goalAmount={campaign.goal_amount}
                    moneyProgress={campaign.money_progress}
                    currentItemQty={campaign.current_item_qty}
                    goalItemQty={campaign.goal_item_qty}
                    itemProgress={campaign.item_progress}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isExpired ? (
                  <p className="text-center text-muted-foreground py-4">Kampanye ini telah berakhir.</p>
                ) : campaign.donation_mode === "both" ? (
                  <Tabs defaultValue="money">
                    <TabsList className="w-full">
                      <TabsTrigger value="money" className="flex-1 gap-1">
                        <Heart className="h-3.5 w-3.5" /> Uang
                      </TabsTrigger>
                      <TabsTrigger value="item" className="flex-1 gap-1">
                        <Package className="h-3.5 w-3.5" /> Barang
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="money">
                      <MoneyDonationForm campaign={campaign} />
                    </TabsContent>
                    <TabsContent value="item">
                      <ItemPledgeForm
                        campaignId={campaign.id}
                        items={campaignItems}
                        collectionPoints={points}
                      />
                    </TabsContent>
                  </Tabs>
                ) : campaign.donation_mode === "money" ? (
                  <MoneyDonationForm campaign={campaign} />
                ) : (
                  <ItemPledgeForm
                    campaignId={campaign.id}
                    items={campaignItems}
                    collectionPoints={points}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
