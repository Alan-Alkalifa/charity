import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/resend/send";

const itemSchema = z.object({
  campaign_item_id: z.string().uuid(),
  qty: z.coerce.number().int().min(1),
});

const schema = z.object({
  campaign_id: z.string().uuid(),
  donor_name: z.string().min(2),
  donor_email: z.string().email().or(z.literal("")).optional(),
  donor_phone: z.string().optional(),
  fulfillment_method: z.enum(["dropoff", "pickup"]),
  collection_point_id: z.string().uuid().optional(),
  donor_address: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data tidak valid", details: parsed.error.flatten() }, { status: 422 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, title, is_active, donation_mode, slug")
    .eq("id", parsed.data.campaign_id)
    .single();

  if (!campaign?.is_active) {
    return NextResponse.json({ error: "Kampanye tidak aktif" }, { status: 400 });
  }
  if (campaign.donation_mode === "money") {
    return NextResponse.json({ error: "Kampanye ini hanya menerima donasi uang" }, { status: 400 });
  }

  const pledges = parsed.data.items.map((item) => ({
    campaign_id: parsed.data.campaign_id,
    campaign_item_id: item.campaign_item_id,
    donor_id: user?.id ?? null,
    donor_name: parsed.data.donor_name,
    donor_email: parsed.data.donor_email || null,
    donor_phone: parsed.data.donor_phone || null,
    qty: item.qty,
    fulfillment_method: parsed.data.fulfillment_method,
    collection_point_id: parsed.data.collection_point_id || null,
    donor_address: parsed.data.donor_address || null,
    notes: parsed.data.notes || null,
    status: "pledged" as const,
  }));

  const { data: inserted, error } = await supabase
    .from("item_pledges")
    .insert(pledges)
    .select();

  if (error || !inserted) {
    return NextResponse.json({ error: "Gagal menyimpan pledge" }, { status: 500 });
  }

  // Send confirmation email if email provided
  if (parsed.data.donor_email) {
    const itemSummary = parsed.data.items
      .map((i) => `• ${i.qty} item`)
      .join("<br/>");

    await sendEmail({
      to: parsed.data.donor_email,
      subject: `Pledge Barang Diterima — ${campaign.title}`,
      html: `
        <h2>Terima kasih, ${parsed.data.donor_name}!</h2>
        <p>Pledge barang Anda untuk kampanye <strong>${campaign.title}</strong> telah dicatat.</p>
        <p><strong>Metode:</strong> ${parsed.data.fulfillment_method === "dropoff" ? "Antar sendiri ke titik pengumpulan" : "Dijemput oleh tim kami"}</p>
        ${parsed.data.fulfillment_method === "pickup" && parsed.data.donor_address
          ? `<p><strong>Alamat:</strong> ${parsed.data.donor_address}</p>`
          : ""}
        <p>Tim kami akan segera menghubungi Anda untuk konfirmasi. Terima kasih atas kebaikan Anda! 🙏</p>
      `,
      template: "pledge_confirm",
      recipientId: user?.id,
      metadata: { campaign_id: campaign.id, pledge_ids: inserted.map((p) => p.id) },
    }).catch(() => null); // Don't fail if email fails
  }

  return NextResponse.json({ ok: true, pledge_count: inserted.length });
}
