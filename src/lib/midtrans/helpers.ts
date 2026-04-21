import { getSnap } from "./client";
import type { MoneyDonation, Campaign } from "@/types";

export interface SnapTokenPayload {
  donation: Pick<
    MoneyDonation,
    "id" | "amount" | "donor_name" | "donor_email" | "donor_phone"
  >;
  campaign: Pick<Campaign, "id" | "title">;
}

/** Create a Midtrans Snap payment token (server-side only) */
export async function createSnapToken({ donation, campaign }: SnapTokenPayload) {
  const orderId = `DON-${donation.id.slice(0, 8).toUpperCase()}-${Date.now()}`;

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: donation.amount,
    },
    item_details: [
      {
        id: campaign.id,
        price: donation.amount,
        quantity: 1,
        name: `Donasi: ${campaign.title}`.slice(0, 50),
      },
    ],
    customer_details: {
      first_name: donation.donor_name ?? "Donatur",
      email: donation.donor_email ?? undefined,
      phone: donation.donor_phone ?? undefined,
    },
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_APP_URL}/campaigns/${campaign.id}/donate/success`,
    },
  };

  const snap = getSnap();
  const transaction = await snap.createTransaction(parameter);
  return { token: transaction.token as string, orderId };
}

/** Verify a Midtrans webhook notification signature */
export function verifyWebhookSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require("crypto") as typeof import("crypto");
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const hash = crypto
    .createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest("hex");
  return hash === signatureKey;
}
