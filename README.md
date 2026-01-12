# Mytale - Hytale Community Hub

> The premier destination for Hytale mods, plugins, and server discovery.

![Mytale](./public/images/hero/Hero.png)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Clerk** | Authentication (Discord/GitHub OAuth) |
| **Supabase** | Database & file storage (Phase 2) |
| **Lucide Icons** | Icon library |

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── servers/           # Server listing
│   └── mods/              # Mods & plugins listing
├── components/
│   ├── layout/            # Header, Footer
│   ├── home/              # Hero, Stats, Featured sections
│   ├── servers/           # Server cards & filters
│   ├── mods/              # Mod cards & filters
│   └── ui/                # Reusable components
├── lib/
│   ├── constants/         # App constants
│   ├── types/             # TypeScript interfaces
│   └── utils/             # Helper functions
└── middleware.ts          # Auth middleware
```

---

## 🔐 Authentication Setup

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Enable Discord and GitHub OAuth
4. Create `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. Restart the dev server

---

## 🗄️ Database Setup (Phase 2)

1. Create a [Supabase](https://supabase.com) project
2. Add your credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

3. Run migrations (coming soon)

---

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, stats, featured content |
| `/servers` | Browse and filter community servers |
| `/mods` | Browse and filter mods, plugins, resource packs |

---

## 🎨 Design System

**Colors:**
- Primary: Amber/Gold (magical, warm)
- Secondary: Forest Green (nature)
- Accent: Cyan/Teal (ice crystals)
- Background: Dark stone

**Fonts:**
- Display: Playfair Display (headings)
- Body: Inter (readable text)

---

## 🚢 Deployment

```bash
# Deploy to Vercel
npx vercel
```

Add environment variables in Vercel dashboard.

---

## 📋 Roadmap

- [x] Project setup
- [x] Home page with hero
- [x] Server listing
- [x] Mods listing
- [x] Auth middleware ready
- [ ] Clerk authentication
- [ ] Supabase integration
- [ ] Detail pages
- [ ] User submissions
- [ ] Ratings & favorites

---

## 📝 License

MIT - Built for the Hytale community

---

*Hytale releases January 13, 2026! 🎮*
