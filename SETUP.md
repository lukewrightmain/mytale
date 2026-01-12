# Mytale Setup Guide

## Quick Start

```bash
cd mytale-app
npm run dev
```

Open http://localhost:3000

---

## Environment Setup

Create a `.env.local` file in the `mytale-app` folder with:

```env
# ─── Clerk Authentication ───
# Get from https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# ─── Supabase Database ───
# Get from https://supabase.com/dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# ─── Site ───
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> ⚠️ **IMPORTANT**: Never commit `.env.local` to git! It's already in `.gitignore`.

---

## Setting Up Clerk (Authentication)

1. Go to [clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. Choose authentication methods:
   - ✅ Discord (recommended for gaming community)
   - ✅ GitHub (for developers)
   - ✅ Email (fallback)
4. Copy your API keys to `.env.local`
5. Restart the dev server

### Clerk Dashboard Features

- User management dashboard
- Session monitoring
- Block/ban users
- Analytics
- Webhooks for syncing with Supabase

---

## Setting Up Supabase (Database)

### Step 1: Create Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Name it **"mytale"**
4. Set a strong database password (save it!)
5. Choose a region close to you
6. Click **"Create new project"** (takes ~2 minutes)

### Step 2: Get API Keys

1. Once created, go to **Settings → API**
2. Copy these to your `.env.local`:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Create Tables

1. Go to **SQL Editor** in Supabase dashboard
2. Click **"New query"**
3. Copy the contents of `supabase/schema.sql` and run it
4. Then copy `supabase/seed.sql` and run it for sample data

### Step 4: Restart Dev Server

```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

Your site should now show real data from Supabase!

---

## Project Structure

```
src/
├── app/                # Pages (Next.js App Router)
│   ├── page.tsx        # Home
│   ├── servers/        # Server list
│   └── mods/           # Mods list
├── components/         # React components
│   ├── layout/         # Header, Footer
│   ├── home/           # Home page sections
│   ├── servers/        # Server components
│   ├── mods/           # Mod components
│   └── ui/             # Reusable UI components
├── lib/                # Utilities
│   ├── constants/      # App constants
│   ├── types/          # TypeScript types
│   ├── utils/          # Helper functions
│   └── supabase/       # Supabase client & queries
└── middleware.ts       # Auth middleware

supabase/
├── schema.sql          # Database tables & RLS
└── seed.sql            # Sample data
```

---

## Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (synced with Clerk) |
| `servers` | Hytale server listings |
| `mods` | Mods, plugins, resource packs |
| `mod_versions` | Version history for mods |
| `favorites` | User favorites |
| `ratings` | User ratings & reviews |

---

## Next Steps

1. ✅ Basic site running
2. ✅ Add Clerk keys for authentication
3. ✅ Set up Supabase for real data
4. ⬜ Create detail pages (/mods/[slug], /servers/[slug])
5. ⬜ Add submission forms for mods/servers
6. ⬜ Sync Clerk users to Supabase profiles
7. ⬜ Deploy to Vercel

---

## Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add your environment variables in the Vercel dashboard:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (your production URL)

---

## Troubleshooting

### "No mods/servers showing"
- Make sure you ran both `schema.sql` AND `seed.sql` in Supabase
- Check that your Supabase keys are correct in `.env.local`
- Restart the dev server after adding keys

### Authentication not working
- Verify Clerk keys are correct
- Make sure you've set up OAuth providers in Clerk dashboard

### Database errors
- Check the Supabase logs in your dashboard
- Ensure RLS policies are enabled (they're in schema.sql)
