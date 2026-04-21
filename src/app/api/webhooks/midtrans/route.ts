import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/midtrans/helpers";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/resend/send";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    fraud_status,
    payment_type,
    transaction_id,
  } = body;

  // Verify signature
  const isValid = verifyWebhookSignature(
    order_id,
    status_code,
    gross_amount,
    signature_key
  );
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const isPaid =
    (transaction_status === "capture" && fraud_status === "accept") ||
    transaction_status === "settlement";

  const isFailed =
    transaction_status === "deny" ||
    transaction_status === "cancel" ||
    transaction_status === "expire";

  const newStatus = isPaid ? "paid" : isFailed ? "failed" : "pending";

  const supabase = await createServiceClient();

  const { data: donation, error } = await supabase
    .from("money_donations")
    .update({
      status: newStatus,
      midtrans_txn_id: transaction_id,
      payment_method: payment_type,
      ...(isPaid ? { paid_at: new Date().toISOString() } : {}),
    })
    .eq("midtrans_order_id", order_id)
    .select("*, campaigns(title)")
    .single();

  if (error || !donation) {
    return NextResponse.json({ error: "Donation not found" }, { status: 404 });
  }

  // Send receipt email on successful payment
  if (isPaid && donation.donor_email) {
    const amount = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(donation.amount);

    await sendEmail({
      to: donation.donor_email,
      subject: `Terima kasih atas donasi Anda — ${(donation as any).campaigns?.title}`,
      html: `
        <h2>Donasi Diterima!</h2>
        <p>Halo ${donation.donor_name ?? "Donatur"},</p>
        <p>Terima kasih telah berdonasi sebesar <strong>${amount}</strong> untuk kampanye
        <strong>${(donation as any).campaigns?.title}</strong>.</p>
        <p>ID Transaksi: ${transaction_id}</p>
        <p>Semoga kebaikan Anda menjadi berkah. 🙏</p>
      `,
      template: "receipt",
      recipientId: donation.donor_id ?? undefined,
      metadata: { donation_id: donation.id, order_id },
    });
  }

  return NextResponse.json({ ok: true });
}
