# Vercel + Supabase Deployment Guide

Complete step-by-step guide to deploy TDC Matchmaker on Vercel with Supabase PostgreSQL.

---

## Prerequisites Checklist

- [ ] GitHub repository pushed: https://github.com/Sarvang18/Matchmaker
- [ ] Vercel account (free tier works)
- [ ] Supabase account (free tier works)
- [ ] All required API keys ready

---

## Part 1: Setup Supabase Database (15 minutes)

### Step 1.1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Click "New Project"

2. **Project Configuration**
   - **Organization**: Select or create one
   - **Name**: `tdc-matchmaker`
   - **Database Password**: Create a STRONG password (save this!)
   - **Region**: Choose closest to your users (e.g., `ap-south-1` for India)
   - **Pricing Plan**: Free tier is fine for development

3. **Wait for provisioning** (takes 2-3 minutes)

### Step 1.2: Get Database Connection String

1. **Navigate to Project Settings**
   - Click on your project
   - Go to: **Settings** → **Database**

2. **Copy Connection String**
   - Scroll to "Connection string"
   - Select **URI** tab
   - Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

3. **Important**: Replace `[YOUR-PASSWORD]` with your actual database password

4. **Add connection pooler for Prisma** (REQUIRED for Vercel):
   - Go to: **Settings** → **Database** → **Connection Pooling**
   - Enable "Use connection pooling"
   - Copy the **Transaction** mode connection string:
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

### Step 1.3: Enable Required Extensions (if needed)

In Supabase SQL Editor:
```sql
-- Run if you need UUID support (optional, Prisma uses cuid by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## Part 2: Prepare Your Project for Deployment

### Step 2.1: Update Build Configuration

Your `package.json` already has the correct build script:
```json
"build": "prisma generate && prisma migrate deploy && next build"
```
✅ This is correct - do NOT change it.

### Step 2.2: Verify Prisma Configuration

Check `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
✅ Already correct.

### Step 2.3: Create Vercel Configuration (Optional but Recommended)

Create `vercel.json` in project root:
```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["bom1"]
}
```

Note: `bom1` = Mumbai region. Change if needed:
- `iad1` = Washington DC
- `sfo1` = San Francisco
- `sin1` = Singapore

---

## Part 3: Deploy to Vercel

### Step 3.1: Import Project to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click **"Add New..."** → **"Project"**

2. **Import Git Repository**
   - Select **GitHub**
   - Authorize Vercel if prompted
   - Search for: `Sarvang18/Matchmaker`
   - Click **Import**

3. **Configure Project**
   - **Project Name**: `tdc-matchmaker` (or your choice)
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave as default (uses package.json)
   - **Output Directory**: Leave as default

### Step 3.2: Add Environment Variables

**CRITICAL**: Add ALL environment variables before deploying.

Click **"Environment Variables"** and add each one:

#### 1. Database
```
DATABASE_URL
```
Value: Your Supabase connection pooler string from Step 1.2:
```
postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

#### 2. NextAuth Configuration
```
NEXTAUTH_SECRET
```
Generate new secret:
```bash
openssl rand -base64 32
```
Value: (paste generated secret)

```
NEXTAUTH_URL
```
Value: `https://your-app-name.vercel.app` (you'll update this after first deploy)

#### 3. Google Gemini API
```
GEMINI_API_KEY
```
Value: Your Gemini API key from: https://aistudio.google.com/app/apikey

#### 4. Gmail SMTP Configuration
```
GMAIL_USER
```
Value: Your Gmail address (e.g., `youremail@gmail.com`)

```
GMAIL_APP_PASSWORD
```
Value: Gmail App Password (get from: https://myaccount.google.com/apppasswords)
- Enable 2FA first if not enabled
- Create app password for "Mail"
- Copy the 16-character password (remove spaces)

#### 5. Magic Link Secret
```
MAGIC_LINK_SECRET
```
Generate with:
```bash
openssl rand -hex 32
```
Value: (paste generated secret)

#### 6. AWS S3 Configuration (for photo uploads)
```
AWS_ACCESS_KEY_ID
```
Value: Your AWS access key

```
AWS_SECRET_ACCESS_KEY
```
Value: Your AWS secret key

```
AWS_S3_BUCKET
```
Value: Your S3 bucket name (e.g., `tdc-matchmaker-photos`)

```
AWS_REGION
```
Value: Your AWS region (e.g., `ap-south-1`)

#### 7. Redis Configuration (Optional - for caching)
```
REDIS_URL
```
Value: 
- **Option A**: Use Upstash (free tier): https://upstash.com/
- **Option B**: Skip Redis for now (comment out Redis code in your app)
- Format: `redis://default:[PASSWORD]@[HOST]:6379`

**For now, you can SKIP Redis** - the app will work without it.

### Step 3.3: Deploy!

1. **Verify all environment variables are added**
2. Click **"Deploy"**
3. Wait 3-5 minutes for build to complete

---

## Part 4: Post-Deployment Setup

### Step 4.1: Check Deployment Status

1. **Monitor Build Logs**
   - Watch for any errors
   - Build should show: ✓ Prisma Generate → ✓ Migrations → ✓ Next.js Build

2. **Common Build Errors**:
   - `DATABASE_URL not found` → Check env vars
   - `Migration failed` → Check database connection string
   - `Prisma timeout` → Use connection pooler, not direct connection

### Step 4.2: Run Database Migrations

Vercel automatically runs `prisma migrate deploy` during build.

If migrations fail, you can manually run them locally:
```bash
# Set Supabase connection string temporarily
$env:DATABASE_URL="postgresql://postgres.[project-ref]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Run migrations
npx prisma migrate deploy

# Verify
npx prisma studio
```

### Step 4.3: Seed Database (Create Admin Account)

**Important**: Vercel doesn't run seed scripts automatically.

**Option 1: Seed Locally** (Recommended)
```bash
# Use Supabase connection string
$env:DATABASE_URL="postgresql://postgres.[project-ref]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Run seed
npx prisma db seed
```

This creates:
- 1 admin account: `admin@tdc.com` / `tdc@2025`
- 100 demo client profiles

**Option 2: Seed via API Route**
Create an API route to seed (only run once):
```typescript
// app/api/admin/seed/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  // Add authentication check here!
  
  const passwordHash = await bcrypt.hash('tdc@2025', 10);
  
  const admin = await prisma.matchmaker.create({
    data: {
      name: 'Admin',
      email: 'admin@tdc.com',
      passwordHash,
      role: 'admin',
    },
  });
  
  return NextResponse.json({ success: true, admin });
}
```

### Step 4.4: Update NEXTAUTH_URL

1. **Get Your Vercel Deployment URL**
   - Example: `https://tdc-matchmaker.vercel.app`

2. **Update Environment Variable**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Find `NEXTAUTH_URL`
   - Edit value to: `https://your-actual-url.vercel.app`
   - Click "Save"

3. **Redeploy**
   - Go to Deployments tab
   - Click "..." on latest deployment → "Redeploy"

### Step 4.5: Test Your Deployment

1. **Visit your app**: `https://your-app.vercel.app`

2. **Test login**:
   - Email: `admin@tdc.com`
   - Password: `tdc@2025`

3. **Test features**:
   - ✅ Dashboard loads
   - ✅ Can view clients (if seeded)
   - ✅ Can add new client
   - ✅ Matching works
   - ✅ Email sending works

---

## Part 5: Troubleshooting Common Issues

### Issue 1: "Internal Server Error" on Login

**Cause**: Database connection or NEXTAUTH_SECRET issue

**Fix**:
```bash
# Check Vercel logs
vercel logs [deployment-url]

# Verify DATABASE_URL in Vercel env vars
# Verify NEXTAUTH_SECRET is set
# Verify NEXTAUTH_URL matches deployment URL
```

### Issue 2: Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'`

**Fix**: Check build logs - `prisma generate` should run before build
```json
// package.json
"postinstall": "prisma generate"
```

### Issue 3: Database Connection Timeout

**Cause**: Using direct connection instead of pooler

**Fix**: Use connection pooler string:
```
postgresql://postgres.[project-ref]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Issue 4: Gmail Emails Not Sending

**Causes**:
- App password not generated
- 2FA not enabled
- Incorrect GMAIL_USER or GMAIL_APP_PASSWORD

**Fix**:
1. Enable 2FA: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update Vercel env vars
4. Redeploy

### Issue 5: AWS S3 Upload Fails

**Fix**:
1. Verify IAM user has S3 permissions
2. Check bucket exists and is in correct region
3. Verify CORS policy on S3 bucket:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["https://your-app.vercel.app"],
    "ExposeHeaders": ["ETag"]
  }
]
```

---

## Part 6: Production Checklist

### Security
- [ ] Change default admin password immediately
- [ ] Use strong NEXTAUTH_SECRET (32+ characters)
- [ ] Use strong MAGIC_LINK_SECRET (64+ characters)
- [ ] Enable Supabase Row Level Security (RLS) if needed
- [ ] Set up Vercel Password Protection (if private app)

### Performance
- [ ] Enable Vercel Analytics
- [ ] Set up Redis caching (Upstash free tier)
- [ ] Optimize images (use Next.js Image component)
- [ ] Enable Supabase connection pooling (already done)

### Monitoring
- [ ] Set up Vercel alerting
- [ ] Monitor Supabase database usage
- [ ] Set up error tracking (Sentry/LogRocket)

### Backups
- [ ] Enable Supabase daily backups (Pro plan)
- [ ] Or set up manual pg_dump backups

---

## Part 7: Custom Domain (Optional)

### Step 7.1: Add Custom Domain in Vercel

1. Go to Vercel Project → Settings → Domains
2. Add your domain (e.g., `matchmaker.thedatecrew.com`)
3. Follow DNS configuration instructions

### Step 7.2: Update Environment Variables

Update these after custom domain is active:
- `NEXTAUTH_URL` → `https://your-custom-domain.com`

Redeploy after updating.

---

## Quick Commands Reference

### Generate Secrets
```bash
# NextAuth Secret (32 bytes base64)
openssl rand -base64 32

# Magic Link Secret (32 bytes hex)
openssl rand -hex 32
```

### Database Operations
```bash
# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio

# Reset database (DANGER!)
npx prisma migrate reset
```

### Vercel CLI (Optional)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from command line
vercel

# View logs
vercel logs [deployment-url]

# Add env var via CLI
vercel env add DATABASE_URL
```

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Prisma + Supabase**: https://www.prisma.io/docs/guides/database/supabase
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

## Estimated Costs (Monthly)

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Vercel | ✅ Free (100GB bandwidth) | $20/month (Pro) |
| Supabase | ✅ Free (500MB database) | $25/month (Pro) |
| AWS S3 | ~$0.50 (5GB storage) | Pay as you go |
| Upstash Redis | ✅ Free (10K requests) | $0.20/100K requests |
| **Total** | **~$0.50/month** | **~$45/month** |

For development/small scale: **Free tier is sufficient!**

---

## Deployment Complete! 🎉

Your TDC Matchmaker is now live on:
- **URL**: https://your-app.vercel.app
- **Database**: Supabase PostgreSQL
- **Hosting**: Vercel Edge Network
- **Global CDN**: Automatic via Vercel

**Next Steps**:
1. Change default admin password
2. Test all features end-to-end
3. Add real client data
4. Share with your team!
