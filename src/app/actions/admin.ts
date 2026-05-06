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
