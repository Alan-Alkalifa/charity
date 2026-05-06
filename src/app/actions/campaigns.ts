"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

function requireAdminClient() {
  return createClient();
}

function parseFormData(formData: FormData) {
  const donationMode = String(formData.get("donation_mode"));
  return {
    title: String(formData.get("title")).trim(),
    slug: String(formData.get("slug")).trim() || slugify(String(formData.get("title"))),
    description: String(formData.get("description") || "").trim() || null,
    content: String(formData.get("content") || "").trim() || null,
    cover_image_url: String(formData.get("cover_image_url") || "").trim() || null,
    donation_mode: donationMode as "money" | "item" | "both",
    category: String(formData.get("category") || "").trim() || null,
    zakat_type: (String(formData.get("zakat_type") || "") || null) as "zakat" | "infaq" | "sadaqah" | null,
    goal_amount: Number(formData.get("goal_amount") || 0),
    goal_item_qty: Number(formData.get("goal_item_qty") || 0),
    is_active: formData.get("is_active") === "on",
    is_featured: formData.get("is_featured") === "on",
    deadline: String(formData.get("deadline") || "").trim() || null,
  };
}

export async function createCampaign(formData: FormData) {
  const supabase = await requireAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Tidak terautentikasi" };

  const fields = parseFormData(formData);
  if (!fields.title) return { error: "Judul kampanye wajib diisi" };

  const { data, error } = await supabase
    .from("campaigns")
    .insert({ ...fields, created_by: user.id })
    .select("slug")
    .single();

  if (error) {
    if (error.code === "23505") return { error: "Slug sudah digunakan. Ubah judul atau slug." };
    return { error: error.message };
  }

  revalidatePath("/campaigns");
  revalidatePath("/admin/campaigns");
  redirect(`/admin/campaigns/${data.slug}`);
}

export async function updateCampaign(slug: string, formData: FormData) {
  const supabase = await requireAdminClient();
  const fields = parseFormData(formData);

  const { error } = await supabase
    .from("campaigns")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  if (error) return { error: error.message };

  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${fields.slug}`);
  revalidatePath("/admin/campaigns");
  revalidatePath(`/admin/campaigns/${fields.slug}`);
  return { success: "Kampanye berhasil diperbarui" };
}

export async function toggleCampaignActive(slug: string, currentValue: boolean) {
  const supabase = await requireAdminClient();
  const { error } = await supabase
    .from("campaigns")
    .update({ is_active: !currentValue, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  if (error) return { error: error.message };
  revalidatePath("/campaigns");
  revalidatePath("/admin/campaigns");
  return { success: true };
}

export async function createCampaignItem(
  campaignId: string,
  formData: FormData
) {
  const supabase = await requireAdminClient();
  const { error } = await supabase.from("campaign_items").insert({
    campaign_id: campaignId,
    name: String(formData.get("name")).trim(),
    description: String(formData.get("description") || "").trim() || null,
    unit_value: Number(formData.get("unit_value") || 0),
    target_qty: Number(formData.get("target_qty") || 1),
    image_url: String(formData.get("image_url") || "").trim() || null,
    sort_order: Number(formData.get("sort_order") || 0),
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/campaigns");
  return { success: true };
}

export async function createCollectionPoint(
  campaignId: string,
  formData: FormData
) {
  const supabase = await requireAdminClient();
  const { error } = await supabase.from("collection_points").insert({
    campaign_id: campaignId,
    name: String(formData.get("name")).trim(),
    address: String(formData.get("address")).trim(),
    maps_url: String(formData.get("maps_url") || "").trim() || null,
    pic_name: String(formData.get("pic_name") || "").trim() || null,
    pic_phone: String(formData.get("pic_phone") || "").trim() || null,
    open_hours: String(formData.get("open_hours") || "").trim() || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/campaigns");
  return { success: true };
}
