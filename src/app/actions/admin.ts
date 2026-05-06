"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { VolunteerStatus } from "@/types";

export async function updateVolunteerStatus(
  volunteerId: string,
  status: VolunteerStatus
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("volunteers")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", volunteerId);

  if (error) return { error: error.message };
  revalidatePath("/admin/volunteers");
  return {};
}

export async function deleteCampaignItem(itemId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("campaign_items").delete().eq("id", itemId);
  if (error) return { error: error.message };
  revalidatePath("/admin/campaigns");
  return {};
}

export async function deleteCollectionPoint(pointId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("collection_points").delete().eq("id", pointId);
  if (error) return { error: error.message };
  revalidatePath("/admin/campaigns");
  return {};
}

export async function deleteCampaignUpdate(updateId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("campaign_updates").delete().eq("id", updateId);
  if (error) return { error: error.message };
  revalidatePath("/admin/campaigns");
  return {};
}

export async function recordManualDonation(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Tidak terautentikasi" };

  const campaignId = String(formData.get("campaignId")).trim();
  const amount = Number(formData.get("amount"));
  const donatedAt = String(formData.get("donated_at")).trim();

  if (!campaignId || !amount || !donatedAt) {
    return { error: "Kampanye, jumlah, dan tanggal donasi wajib diisi" };
  }

  const { error } = await supabase.from("manual_donations").insert({
    campaign_id: campaignId,
    recorded_by: user.id,
    amount,
    donor_name: String(formData.get("donor_name") || "").trim() || null,
    donor_phone: String(formData.get("donor_phone") || "").trim() || null,
    zakat_type: String(formData.get("zakat_type") || "").trim() || null,
    payment_proof_url: String(formData.get("payment_proof_url") || "").trim() || null,
    notes: String(formData.get("notes") || "").trim() || null,
    donated_at: donatedAt,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/donations");
  return {};
}
