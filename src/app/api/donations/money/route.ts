import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createSnapToken } from "@/lib/midtrans/helpers";

const schema = z.object({
  campaign_id: z.string().uuid(),
  donor_name: z.string().min(2),
  donor_email: z.string().email().or(z.literal("")).optional(),
  donor_phone: z.string().optional(),
  amount: z.coerce.number().min(5_000),
  zakat_type: z.enum(["zakat", "infaq", "sadaqah"]).optional(),
  is_anonymous: z.boolean().default(false),
  on_behalf_of: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data tidak valid", details: parsed.error.flatten() }, { status: 422 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch campaign to validate it exists and is active
  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select("id, title, is_active, donation_mode")
    .eq("id", parsed.data.campaign_id)
    .single();

  if (campaignError || !campaign) {
    return NextResponse.json({ error: "Kampanye tidak ditemukan" }, { status: 404 });
  }
  if (!campaign.is_active) {
    return NextResponse.json({ error: "Kampanye sudah tidak aktif" }, { status: 400 });
  }
  if (campaign.donation_mode === "item") {
    return NextResponse.json({ error: "Kampanye ini hanya menerima donasi barang" }, { status: 400 });
  }

  // Create pending donation record
  const { data: donation, error: insertError } = await supabase
    .from("money_donations")
    .insert({
      campaign_id: parsed.data.campaign_id,
      donor_id: user?.id ?? null,
      donor_name: parsed.data.is_anonymous ? "Anonim" : (parsed.data.donor_name ?? null),
      donor_email: parsed.data.donor_email || null,
      donor_phone: parsed.data.donor_phone || null,
      amount: parsed.data.amount,
      zakat_type: parsed.data.zakat_type ?? null,
      is_anonymous: parsed.data.is_anonymous,
      on_behalf_of: parsed.data.on_behalf_of || null,
      status: "pending",
    })
    .select()
    .single();

  if (insertError || !donation) {
    return NextResponse.json({ error: "Gagal membuat transaksi" }, { status: 500 });
  }

  // Get Snap token from Midtrans
  try {
    const { token, orderId } = await createSnapToken({
      donation: {
        id: donation.id,
        amount: donation.amount,
        donor_name: parsed.data.donor_name,
        donor_email: parsed.data.donor_email || null,
        donor_phone: parsed.data.donor_phone || null,
      },
      campaign: { id: campaign.id, title: campaign.title },
    });

    // Save order_id back to donation
    await supabase
      .from("money_donations")
      .update({ midtrans_order_id: orderId })
      .eq("id", donation.id);

    return NextResponse.json({ token, donation_id: donation.id });
  } catch (e: unknown) {
    // Rollback donation if Midtrans fails
    await supabase.from("money_donations").delete().eq("id", donation.id);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Gagal menghubungi payment gateway" },
      { status: 502 }
    );
  }
}
