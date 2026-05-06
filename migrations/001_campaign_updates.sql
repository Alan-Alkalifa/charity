-- Campaign Updates/Posts
CREATE TABLE IF NOT EXISTS campaign_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  created_by uuid NOT NULL REFERENCES profiles(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campaign_updates_campaign_id ON campaign_updates(campaign_id);

ALTER TABLE campaign_updates ENABLE ROW LEVEL SECURITY;

-- Campaign Updates RLS
DROP POLICY IF EXISTS "Updates readable for active campaigns" ON campaign_updates;
DROP POLICY IF EXISTS "Admin can manage campaign updates" ON campaign_updates;

CREATE POLICY "Updates readable for active campaigns" ON campaign_updates FOR SELECT USING (
  EXISTS (SELECT 1 FROM campaigns WHERE id = campaign_id AND is_active = true)
);
CREATE POLICY "Admin can manage campaign updates" ON campaign_updates USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);
