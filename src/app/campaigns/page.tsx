import type { Metadata } from "next";
import { getCampaigns } from "@/lib/supabase/queries";
import { CampaignGrid } from "@/components/campaigns/campaign-grid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = { title: "Kampanye" };
export const revalidate = 60;

const CATEGORIES = ["pendidikan", "kesehatan", "bencana", "lingkungan", "sosial"];
const MODES = [
  { value: "", label: "Semua" },
  { value: "money", label: "Donasi Uang" },
  { value: "item", label: "Donasi Barang" },
  { value: "both", label: "Keduanya" },
];

interface Props {
  searchParams: Promise<{ category?: string; mode?: string }>;
}

export default async function CampaignsPage({ searchParams }: Props) {
  const { category, mode } = await searchParams;

  const campaigns = await getCampaigns({
    category: category || undefined,
    donation_mode: mode || undefined,
  });

  return (
    <section className="container mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Semua Kampanye</h1>
        <p className="text-muted-foreground">
          Pilih kampanye yang ingin Anda dukung — donasikan uang, barang, atau keduanya.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <Link key={m.value} href={`/campaigns?${new URLSearchParams({ ...(category ? { category } : {}), ...(m.value ? { mode: m.value } : {}) })}`}>
              <Button
                variant={mode === m.value || (!mode && !m.value) ? "default" : "outline"}
                size="sm"
              >
                {m.label}
              </Button>
            </Link>
          ))}
        </div>
        <div className="w-full flex flex-wrap gap-2 mt-1">
          <Link href={`/campaigns${mode ? `?mode=${mode}` : ""}`}>
            <Button variant={!category ? "secondary" : "ghost"} size="sm">Semua Kategori</Button>
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/campaigns?${new URLSearchParams({ ...(mode ? { mode } : {}), category: cat })}`}
            >
              <Button
                variant={category === cat ? "secondary" : "ghost"}
                size="sm"
                className="capitalize"
              >
                {cat}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">{campaigns.length} kampanye ditemukan</p>

      {/* Grid */}
      <CampaignGrid campaigns={campaigns} />
    </section>
  );
}
