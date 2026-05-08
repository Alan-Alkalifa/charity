# Operations Runbook — Charity Donation Portal

**Production URL:** https://charity-gold-ten.vercel.app  
**Supabase project:** `rzxtycbwyprtknpjgqgl` (ap-southeast-1)  
**Vercel project:** `prj_fYVO01ErfLxJZhdnPzo9qhvfDnVV`

---

## 1. Secret Rotation Procedure

### 1.1 Supabase Service Role Key
1. Supabase Dashboard → Project Settings → API → **Regenerate** `service_role` key.
2. Update `SUPABASE_SERVICE_ROLE_KEY` in Vercel → Environment Variables (Production + Preview).
3. Trigger redeploy (push empty commit or click Redeploy in Vercel).
4. Verify `GET /api/health` returns 200.
5. Revoke old key in Supabase once traffic is healthy.

### 1.2 Stripe Secret Key
1. Stripe Dashboard → Developers → API keys → **Roll** the secret key.
2. Update `STRIPE_SECRET_KEY` in Vercel (Production + Preview). Redeploy.
3. Run a test donation to confirm Stripe processes correctly.
4. Revoke old key in Stripe after 10 minutes.

### 1.3 Stripe Webhook Secret
1. Stripe Dashboard → Developers → Webhooks → select production endpoint.
2. Click **Roll secret** → copy new `whsec_...` value.
3. Update `STRIPE_WEBHOOK_SECRET` in Vercel (Production). Redeploy.

### 1.4 Resend API Key
1. Resend Dashboard → API Keys → **Create API Key** with same permissions.
2. Update `RESEND_API_KEY` in Vercel (Production + Preview). Redeploy.
3. Trigger a donation confirmation email to verify delivery.
4. Delete old key in Resend.

### 1.5 Rotation Schedule

| Secret | Interval | Owner |
|---|---|---|
| Supabase service role key | 90 days or on breach | DevOps |
| Stripe secret key | On engineer offboarding or breach | DevOps |
| Stripe webhook secret | 180 days | DevOps |
| Resend API key | 180 days | DevOps |

---

## 2. Incident Response: Payment Failures

### 2.1 Detection
- Stripe Dashboard → Developers → Events → filter `payment_intent.payment_failed`.
- Vercel runtime logs: filter for `/api/donations` or `/api/webhooks/stripe`.
- User support reports.

### 2.2 Triage Checklist
```bash
# Is Stripe reachable?
curl https://api.stripe.com/v1/charges -u $STRIPE_SECRET_KEY:

# Is our webhook responding?
# Stripe Dashboard → Webhooks → recent deliveries → check for 4xx/5xx

# Is DB writable?
# Supabase dashboard → Logs → Postgres → filter error
```

### 2.3 Escalation Matrix

| Severity | Condition | Action |
|---|---|---|
| P0 | All payments failing >5 min | Page on-call engineer immediately |
| P1 | >20% failure rate | Notify engineering lead within 15 min |
| P2 | Isolated user reports | Log ticket, investigate within 2 hrs |

### 2.4 Common Failure Modes

**Webhook signature mismatch (400 from `/api/webhooks/stripe`)**  
Fix: Re-copy `whsec_...` from Stripe Dashboard → Webhooks → Signing secret. Update Vercel env, redeploy.

**DB write failures during donation**  
Fix: Check Supabase Logs → Postgres for errors. Verify `donations` table RLS policies allow inserts.

**Vercel function timeout (>10s)**  
Fix: Use PgBouncer pooled port 6543 (`db.rzxtycbwyprtknpjgqgl.supabase.co:6543`) instead of direct port 5432 for high-load scenarios.

**Midtrans gateway errors**  
Fix: Check Midtrans dashboard for expired credentials or IP whitelist issues. Regenerate server/client keys.

### 2.5 Post-Incident
1. Document timeline in incident log.
2. Create follow-up Paperclip issue for root-cause fix.
3. Update this runbook if new failure mode found.

---

## 3. Supabase Connection Pooling (PgBouncer)

PgBouncer is available by default at port **6543** (transaction mode).  
The Supabase JS client uses PostgREST (port 443) — no extra config needed.  
Only set port 6543 if using a raw Postgres driver (Prisma, Drizzle, pg).

---

## 4. Vercel Environment Variables

Set in Vercel → Project → Settings → Environment Variables for **Production** and **Preview**:

| Variable | Value / Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rzxtycbwyprtknpjgqgl.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (secret) |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API keys |
| `RESEND_API_KEY` | Resend → API Keys |

---

## 5. Required GitHub Actions Secrets

Add in GitHub → Repo Settings → Secrets → Actions:

| Secret | Source |
|---|---|
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rzxtycbwyprtknpjgqgl.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase API settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase API settings (secret) |
| `STRIPE_SECRET_KEY` | Stripe API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe API keys |
| `RESEND_API_KEY` | Resend Dashboard |

---

## 6. Stripe Webhook Registration

1. Stripe Dashboard → Developers → Webhooks → **Add endpoint**.
2. URL: `https://charity-gold-ten.vercel.app/api/webhooks/stripe`
3. Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `checkout.session.completed`
4. Copy signing secret (`whsec_...`) → store as `STRIPE_WEBHOOK_SECRET` in Vercel.

---

## 7. Uptime Monitoring (BetterUptime)

1. Sign up at betteruptime.com.
2. Add monitor: `https://charity-gold-ten.vercel.app` — check interval 30s.
3. Alert condition: downtime > 1 minute.
4. Add on-call email/Slack webhook.

---

## 8. Cache-Control Headers

Campaign pages must return `Cache-Control: s-maxage=300, stale-while-revalidate=600`.

Verify:
```bash
curl -I https://charity-gold-ten.vercel.app/campaigns/[slug] | grep -i cache-control
```

If missing, add to `next.config.ts`:
```ts
async headers() {
  return [{
    source: '/campaigns/:slug',
    headers: [{ key: 'Cache-Control', value: 's-maxage=300, stale-while-revalidate=600' }],
  }]
},
```
