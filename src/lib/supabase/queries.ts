import { createClient } from "./server";
import type { Campaign, CampaignItem, CollectionPoint, MoneyDonation, ItemPledge } from "@/types";
import { calcProgress } from "@/lib/utils";

export async function getCampaigns(filters?: {
  category?: string;
  donation_mode?: string;
  featured?: boolean;
  active?: boolean;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("campaigns")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.donation_mode) query = query.eq("donation_mode", filters.donation_mode);
  if (filters?.featured) query = query.eq("is_featured", true);
  if (filters?.active !== undefined) query = query.eq("is_active", filters.active);
  else query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) throw error;
  return (data as Campaign[]).map((c) => ({
    ...c,
    money_progress: calcProgress(c.current_amount, c.goal_amount),
    item_progress: calcProgress(c.current_item_qty, c.goal_item_qty),
  }));
}

export async function getCampaignBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  const c = data as Campaign;
  return {
    ...c,
    money_progress: calcProgress(c.current_amount, c.goal_amount),
    item_progress: calcProgress(c.current_item_qty, c.goal_item_qty),
  };
}

export async function getCampaignItems(campaignId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaign_items")
    .select("*")
    .eq("campaign_id", campaignId)
    .order("sort_order");
  if (error) return [];
  return data as CampaignItem[];
}

export async function getCollectionPoints(campaignId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collection_points")
    .select("*")
    .eq("campaign_id", campaignId)
    .eq("is_active", true);
  if (error) return [];
  return data as CollectionPoint[];
}

export async function getDonorMoneyDonations(donorId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("money_donations")
    .select("*, campaigns(title, slug)")
    .eq("donor_id", donorId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data as (MoneyDonation & { campaigns: { title: string; slug: string } | null })[];
}

export async function getDonorItemPledges(donorId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("item_pledges")
    .select("*, campaigns(title, slug), campaign_items(name, image_url)")
    .eq("donor_id", donorId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data as (ItemPledge & {
    campaigns: { title: string; slug: string } | null;
    campaign_items: { name: string; image_url: string | null } | null;
  })[];
}

export async function getAdminStats() {
  const supabase = await createClient();
  const [campaigns, moneyDonations, itemPledges, volunteers] = await Promise.all([
    supabase.from("campaigns").select("id, is_active", { count: "exact" }),
    supabase.from("money_donations").select("amount, status"),
    supabase.from("item_pledges").select("qty, status"),
    supabase.from("volunteers").select("id, status", { count: "exact" }),
  ]);

  const paidDonations = moneyDonations.data?.filter((d) => d.status === "paid") ?? [];
  const totalRaised = paidDonations.reduce((sum, d) => sum + Number(d.amount), 0);
  const totalItems = itemPledges.data?.reduce((sum, p) => sum + p.qty, 0) ?? 0;

  return {
    activeCampaigns: campaigns.data?.filter((c) => c.is_active).length ?? 0,
    totalRaised,
    totalItems,
    pendingVolunteers: volunteers.data?.filter((v) => v.status === "pending").length ?? 0,
  };
}
