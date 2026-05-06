export type Role = "donor" | "volunteer" | "staff" | "admin";
export type DonationMode = "money" | "item" | "both";
export type ZakatType = "zakat" | "infaq" | "sadaqah";
export type DonationStatus = "pending" | "paid" | "failed" | "expired" | "refunded";
export type PledgeStatus = "pledged" | "confirmed" | "received" | "completed" | "cancelled";
export type FulfillmentMethod = "dropoff" | "pickup";
export type VolunteerStatus = "pending" | "approved" | "active" | "inactive";
export type EmailTemplate =
  | "receipt"
  | "pledge_confirm"
  | "volunteer_welcome"
  | "campaign_update"
  | "contact";
export type EmailStatus = "sent" | "delivered" | "bounced" | "failed";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  cover_image_url: string | null;
  donation_mode: DonationMode;
  category: string | null;
  zakat_type: ZakatType | null;
  goal_amount: number;
  current_amount: number;
  goal_item_qty: number;
  current_item_qty: number;
  is_active: boolean;
  is_featured: boolean;
  deadline: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignUpdate {
  id: string;
  campaign_id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignItem {
  id: string;
  campaign_id: string;
  name: string;
  description: string | null;
  unit_value: number;
  target_qty: number;
  pledged_qty: number;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface CollectionPoint {
  id: string;
  campaign_id: string;
  name: string;
  address: string;
  maps_url: string | null;
  pic_name: string | null;
  pic_phone: string | null;
  open_hours: string | null;
  is_active: boolean;
  created_at: string;
}

export interface MoneyDonation {
  id: string;
  campaign_id: string;
  donor_id: string | null;
  donor_name: string | null;
  donor_email: string | null;
  donor_phone: string | null;
  amount: number;
  midtrans_order_id: string | null;
  midtrans_txn_id: string | null;
  payment_method: string | null;
  status: DonationStatus;
  zakat_type: ZakatType | null;
  is_anonymous: boolean;
  on_behalf_of: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface ItemPledge {
  id: string;
  campaign_id: string;
  campaign_item_id: string;
  donor_id: string | null;
  donor_name: string | null;
  donor_email: string | null;
  donor_phone: string | null;
  qty: number;
  fulfillment_method: FulfillmentMethod;
  collection_point_id: string | null;
  donor_address: string | null;
  status: PledgeStatus;
  notes: string | null;
  received_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface ManualDonation {
  id: string;
  campaign_id: string;
  recorded_by: string;
  amount: number;
  donor_name: string | null;
  donor_phone: string | null;
  payment_proof_url: string | null;
  zakat_type: ZakatType | null;
  notes: string | null;
  donated_at: string;
  created_at: string;
}

export interface Volunteer {
  id: string;
  profile_id: string;
  motivation: string | null;
  skills: string[] | null;
  availability: string | null;
  area: string | null;
  status: VolunteerStatus;
  notes: string | null;
  applied_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  recipient_id: string | null;
  to_email: string;
  template: EmailTemplate;
  resend_id: string | null;
  status: EmailStatus;
  metadata: Record<string, unknown> | null;
  sent_at: string;
}

/* ---------- joined/derived types used in UI ---------- */

export type CampaignWithStats = Campaign & {
  money_progress: number;   // 0–100
  item_progress: number;    // 0–100
};

export type CampaignItemWithCampaign = CampaignItem & {
  campaign: Pick<Campaign, "id" | "title" | "slug">;
};
