# Deployment Guide: Grand Line Exchange

This guide covers deploying to **Vercel** with **PostgreSQL** (Neon, Vercel Postgres, or Supabase).

---

## 1. Create a PostgreSQL Database

Choose one:

### Option A: Neon (recommended, free tier)
1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy both connection strings from the dashboard:
   - **Pooled connection** → use for `DATABASE_URL`
   - **Direct connection** → use for `DIRECT_URL`

### Option B: Vercel Postgres
1. In your Vercel project → **Storage** → **Create Database** → **Postgres**
2. Connect it to your project
3. Vercel auto-sets `POSTGRES_URL` and `POSTGRES_URL_NON_POOLING`
4. In **Settings** → **Environment Variables**, add:
   - `DATABASE_URL` = `POSTGRES_URL` (or the pooled URL from the Storage tab)
   - `DIRECT_URL` = `POSTGRES_URL_NON_POOLING`

### Option C: Supabase
1. Go to [supabase.com](https://supabase.com) and create a project
2. **Settings** → **Database** → **Connection string** → **URI**
3. For connection pooling, use the **Transaction** pooler URL for `DATABASE_URL`
4. Use the **Direct** connection URL for `DIRECT_URL`
5. Or set both to the same URL if using a single connection

---

## 2. Set Environment Variables

In Vercel → **Settings** → **Environment Variables**, add:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (pooled for serverless) |
| `DIRECT_URL` | Direct PostgreSQL connection (for migrations) |
| `NEXTAUTH_SECRET` | Random string, 32+ chars (e.g. `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Your production URL (e.g. `https://yourdomain.com`) |
| `RESEND_API_KEY` | From [resend.com](https://resend.com) |
| `RECOMMENDATIONS_EMAIL` | Email for character recommendations |

---

## 3. Deploy to Vercel

1. Push your code to **GitHub**
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add all environment variables (step 2)
4. **Deploy**

The build runs:
- `prisma generate` – generates Prisma client
- `prisma migrate deploy` – applies database migrations
- `next build` – builds the Next.js app

---

## 4. Run the Seed (First-Time Setup)

After the first deploy, seed the database with characters and initial prices:

**Option 1: Vercel CLI**
```bash
vercel env pull .env.local
npx prisma db seed
```

**Option 2: Neon/Supabase Dashboard**
- Use a SQL client or run `npx prisma db seed` locally with your production `DATABASE_URL` set

**Option 3: Add a seed API route** (optional, for one-time use)
- Create `/api/seed` that runs the seed script (protect with a secret key)

---

## 5. Connect Your SquareSpace Domain

1. In **Vercel** → your project → **Settings** → **Domains** → Add your domain
2. In **SquareSpace** → **Settings** → **Domains** → **DNS Settings** for your domain
3. Add records:
   - **A record**: `@` → `76.76.21.21`
   - **CNAME record**: `www` → `cname.vercel-dns.com`
4. Update `NEXTAUTH_URL` in Vercel to your production domain
5. Redeploy after DNS propagates

---

## Local Development with PostgreSQL

1. Create a local Postgres DB (Docker, Postgres.app, or hosted)
2. Copy `.env.example` to `.env`
3. Set `DATABASE_URL` and `DIRECT_URL`
4. Run:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   npm run dev
   ```
