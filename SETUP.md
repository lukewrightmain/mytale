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

# ─── Site ───
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

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

## Setting Up Supabase (Database - Later)

1. Go to [supabase.com](https://supabase.com) and create project
2. Get your project URL and anon key from Settings > API
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
   ```
4. Run the migration in `supabase/migrations/`

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
│   └── utils/          # Helper functions
└── middleware.ts       # Auth middleware
```

---

## Next Steps

1. ✅ Basic site running
2. ⬜ Add Clerk keys for authentication
3. ⬜ Set up Supabase for real data
4. ⬜ Create detail pages (/mods/[slug], /servers/[slug])
5. ⬜ Add submission forms
6. ⬜ Deploy to Vercel

---

## Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add your environment variables in the Vercel dashboard.

