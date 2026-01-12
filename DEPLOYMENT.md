# Mytale Deployment Guide

Complete guide to deploying Mytale securely to production.

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Namecheap     │────▶│     Vercel      │────▶│    Supabase     │
│   (DNS)         │     │   (Hosting)     │     │   (Database)    │
│   mytale.gg     │     │   Next.js App   │     │   PostgreSQL    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │      Clerk      │
                        │ (Authentication)│
                        └─────────────────┘
```

## Pre-Deployment Checklist

### 1. Environment Variables Audit

**NEVER commit these to Git:**
- `SUPABASE_SERVICE_ROLE_KEY` - Full database access
- `CLERK_SECRET_KEY` - Authentication secrets
- Any API keys or tokens

**Verify .gitignore includes:**
```
.env
.env.local
.env.production
.env*.local
```

### 2. Security Headers (Already configured in next.config.ts)

Ensure these headers are set:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`
- `X-XSS-Protection: 1; mode=block`

---

## Step 1: Supabase Production Setup

### 1.1 Create Production Project

1. Go to [supabase.com](https://supabase.com)
2. Create a **new project** for production (separate from development)
3. Choose a strong database password
4. Select region closest to your users (e.g., US East for NA audience)

### 1.2 Run Database Migrations

In Supabase SQL Editor, run migrations in order:
1. `schema.sql` - Base tables
2. `migrations/002_add_support_url.sql`
3. `migrations/003_storage_bucket.sql`
4. `migrations/004_maps_textures.sql`
5. `migrations/005_plugins.sql`
6. `migrations/006_download_tracking.sql`
7. `migrations/007_fix_rls_policies.sql`
8. `migrations/008_ideas.sql`

### 1.3 Configure Storage

1. Go to Storage → Create bucket: `content-images`
2. Set to **Public** bucket
3. Add policies for authenticated uploads

### 1.4 Get Production Keys

From Supabase Dashboard → Settings → API:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Keep this SECRET!)

### 1.5 Enable Row Level Security

Verify RLS is enabled on all tables. The service role key bypasses RLS for server-side operations.

---

## Step 2: Clerk Production Setup

### 2.1 Create Production Instance

1. Go to [clerk.com](https://clerk.com)
2. In your app, go to **Instance** → Create production instance
3. Or create a new application for production

### 2.2 Configure OAuth Providers

1. Go to User & Authentication → Social Connections
2. Enable Discord and/or other providers
3. Add production callback URLs

### 2.3 Configure Allowed Origins

In Clerk Dashboard → Paths:
- Add `https://mytale.gg`
- Add `https://www.mytale.gg`

### 2.4 Get Production Keys

From Clerk Dashboard → API Keys:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

---

## Step 3: Vercel Deployment

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the `mytale-app` directory as root

### 3.2 Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

```
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Clerk (Production)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Site URL
NEXT_PUBLIC_SITE_URL=https://mytale.gg
```

**Important:** Set these for "Production" environment only. Use different values for Preview/Development.

### 3.3 Build Settings

Vercel should auto-detect Next.js. Verify:
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 3.4 Deploy

Click "Deploy" and wait for the build to complete.

---

## Step 4: Namecheap DNS Configuration

### 4.1 Get Vercel DNS Records

After deploying, go to Vercel → Project → Settings → Domains

Add your domain: `mytale.gg`

Vercel will show you the required DNS records.

### 4.2 Configure Namecheap

1. Log into Namecheap → Domain List → mytale.gg → Manage
2. Go to Advanced DNS
3. Delete any existing records (except NS records if using Namecheap DNS)

**Add these records:**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | Automatic |
| CNAME | www | cname.vercel-dns.com. | Automatic |

**Alternative (Vercel Nameservers - Recommended):**

For best performance, use Vercel's nameservers:
1. In Namecheap, set Custom DNS
2. Add Vercel nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

### 4.3 Wait for Propagation

DNS changes can take 24-48 hours to propagate globally, though often it's faster (5-30 minutes).

---

## Step 5: SSL/HTTPS (Automatic)

Vercel automatically provisions SSL certificates via Let's Encrypt. No action needed.

Verify:
- `https://mytale.gg` works
- `https://www.mytale.gg` redirects properly

---

## Step 6: Security Hardening

### 6.1 Supabase Security

1. **Database Password:** Use a strong, unique password
2. **API Rate Limiting:** Enable in Supabase Dashboard
3. **Row Level Security:** Already configured via migrations
4. **Connection Pooling:** Enable for production

### 6.2 Clerk Security

1. **Session Lifetime:** Set appropriate session duration
2. **Password Policy:** Require strong passwords
3. **Bot Protection:** Enable in Clerk Dashboard
4. **Allowed Origins:** Only allow your production domain

### 6.3 Vercel Security

1. **Deployment Protection:** Enable in Project Settings
2. **Environment Variable Encryption:** Automatic
3. **DDoS Protection:** Built-in
4. **Edge Network:** Automatic CDN distribution

### 6.4 Application Security

1. **HTTPS Only:** Automatic via Vercel
2. **Security Headers:** Configured in next.config.ts
3. **Input Validation:** Server-side validation in actions
4. **XSS Protection:** React's built-in escaping

---

## Step 7: Monitoring & Alerts

### 7.1 Vercel Analytics (Recommended)

1. Enable in Vercel Dashboard → Analytics
2. Monitor Core Web Vitals
3. Track page views and user behavior

### 7.2 Error Tracking

Consider adding Sentry for error tracking:
```bash
npm install @sentry/nextjs
```

### 7.3 Uptime Monitoring

Use free services like:
- [UptimeRobot](https://uptimerobot.com)
- [Better Uptime](https://betteruptime.com)
- [Checkly](https://www.checklyhq.com)

---

## Step 8: Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test user registration and login
- [ ] Test mod/server/plugin submission
- [ ] Test download tracking
- [ ] Test idea voting
- [ ] Verify images load from Supabase Storage
- [ ] Check mobile responsiveness
- [ ] Verify SEO meta tags with [metatags.io](https://metatags.io)
- [ ] Submit sitemap to Google Search Console
- [ ] Test Discord and Twitter social links

---

## Maintenance

### Regular Tasks

1. **Monitor Supabase usage** - Stay within free tier limits
2. **Review Vercel logs** - Check for errors
3. **Update dependencies** - Run `npm audit` regularly
4. **Backup database** - Enable Supabase point-in-time recovery

### Updating the Site

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel automatically deploys on push to main branch.

---

## Troubleshooting

### DNS Not Resolving
- Wait 24-48 hours for propagation
- Check with [whatsmydns.net](https://whatsmydns.net)

### Build Failures
- Check Vercel build logs
- Ensure all environment variables are set

### Authentication Issues
- Verify Clerk allowed origins
- Check Clerk production keys are used

### Database Connection Errors
- Verify Supabase URL and keys
- Check RLS policies allow the operation

---

## Cost Estimates (Monthly)

| Service | Free Tier | When You'll Pay |
|---------|-----------|-----------------|
| Vercel | 100GB bandwidth, unlimited deployments | Heavy traffic (>100GB/mo) |
| Supabase | 500MB database, 1GB storage, 2GB bandwidth | Large files, heavy traffic |
| Clerk | 10,000 MAU | >10,000 monthly active users |
| Namecheap | N/A | ~$10-15/year for domain |

**Total estimated cost: $10-15/year** (domain only) until you hit traffic limits.

---

## Emergency Contacts

- **Vercel Status:** https://www.vercel-status.com
- **Supabase Status:** https://status.supabase.com
- **Clerk Status:** https://status.clerk.com

