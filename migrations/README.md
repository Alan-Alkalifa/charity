# Database Migrations

This directory contains SQL migrations for the BloomInKindes database.

## Running Migrations

1. **Go to Supabase Dashboard**: https://app.supabase.com/project/rzxtycbwyprtknpjgqgl/sql
2. **Create a new query**
3. **Copy and paste the entire contents of the migration file**
4. **Click "Run"**

## Available Migrations

### 000_auth_trigger.sql ⚠️ **RUN THIS FIRST**

Creates automatic profile creation when new users sign up:

- `handle_new_user()` function: Triggered on auth.users insert
- Automatically creates profile record with user's full_name
- Essential for: User registration, role-based access control, admin features

**Status:** CRITICAL - Run immediately before users can sign up

### 001_campaign_updates.sql

Adds support for campaign updates/posts feature:

- `campaign_updates` table: Store campaign updates and announcements
- RLS policies: Public-readable for active campaigns, admin-manageable
- Index on `campaign_id` for fast lookups

**Required for:**
- Admin page: `/admin/campaigns/[slug]` - updates tab
- Public page: `/campaigns/[slug]` - updates display
- API endpoint: `POST /api/campaigns/[id]/updates`

**Run before:** Deploying the campaign updates feature to production

## Migration Status

- [ ] 000_auth_trigger.sql - **CRITICAL: Deploy this first**
- [ ] 001_campaign_updates.sql - Deploy after auth trigger

## Future Migrations

Reserve the following numbers for future features:
- 002_* - Reserved for future enhancements
- 003_* - Reserved for future enhancements
