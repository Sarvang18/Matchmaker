# Deployment Quick Checklist ✅

Use this checklist while deploying. Check off each item as you complete it.

---

## Phase 1: Supabase Setup (15 min)

- [ ] Create Supabase account at https://supabase.com
- [ ] Create new project named `tdc-matchmaker`
- [ ] Save database password securely
- [ ] Copy connection string from Settings → Database
- [ ] Copy connection pooler string (Transaction mode)
- [ ] Test connection locally:
```bash
$env:DATABASE_URL="your-supabase-pooler-url"
npx prisma migrate deploy
```

---

## Phase 2: Get All API Keys (10 min)

### Google Gemini API
- [ ] Visit: https://aistudio.google.com/app/apikey
- [ ] Create API key
- [ ] Save: `GEMINI_API_KEY`

### Gmail App Password
- [ ] Enable 2FA: https://myaccount.google.com/security
- [ ] Generate App Password: https://myaccount.google.com/apppasswords
- [ ] Select: Mail → Other
- [ ] Save: `GMAIL_USER` and `GMAIL_APP_PASSWORD`

### Generate Secrets
```bash
# Run these commands
openssl rand -base64 32  # NEXTAUTH_SECRET
openssl rand -hex 32     # MAGIC_LINK_SECRET
```
- [ ] Save both secrets

### AWS (if using S3 for photos)
- [ ] Get `AWS_ACCESS_KEY_ID`
- [ ] Get `AWS_SECRET_ACCESS_KEY`
- [ ] Note `AWS_S3_BUCKET` name
- [ ] Note `AWS_REGION`

---

## Phase 3: Deploy to Vercel (10 min)

- [ ] Go to https://vercel.com/dashboard
- [ ] Click "Add New Project"
- [ ] Import `Sarvang18/Matchmaker` from GitHub
- [ ] Configure project:
  - [ ] Project name: `tdc-matchmaker`
  - [ ] Framework: Next.js (auto-detected)
  - [ ] Root directory: `./`

### Add Environment Variables (CRITICAL!)

Copy-paste each variable:

```bash
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
NEXTAUTH_SECRET=[your-base64-secret]
NEXTAUTH_URL=https://tdc-matchmaker.vercel.app
GEMINI_API_KEY=[your-gemini-key]
GMAIL_USER=[your-email@gmail.com]
GMAIL_APP_PASSWORD=[16-char-password]
MAGIC_LINK_SECRET=[your-hex-secret]
AWS_ACCESS_KEY_ID=[your-aws-key]
AWS_SECRET_ACCESS_KEY=[your-aws-secret]
AWS_S3_BUCKET=[your-bucket-name]
AWS_REGION=ap-south-1
```

- [ ] All 11 environment variables added
- [ ] Click "Deploy"
- [ ] Wait 3-5 minutes

---

## Phase 4: Post-Deployment (5 min)

### Seed Database
```bash
# Set Supabase URL
$env:DATABASE_URL="your-supabase-pooler-url"

# Run seed
npx prisma db seed
```

- [ ] Seed completed (creates admin + 100 demo clients)
- [ ] Verify in Prisma Studio: `npx prisma studio`

### Update NEXTAUTH_URL
- [ ] Copy actual Vercel URL (e.g., `https://tdc-matchmaker-abc123.vercel.app`)
- [ ] Go to Vercel → Settings → Environment Variables
- [ ] Update `NEXTAUTH_URL` with actual URL
- [ ] Click "Redeploy" in Deployments tab

---

## Phase 5: Verification (5 min)

- [ ] Visit your Vercel URL
- [ ] Login works:
  - Email: `admin@tdc.com`
  - Password: `tdc@2025`
- [ ] Dashboard loads
- [ ] Clients list shows 100 profiles
- [ ] Can view client details
- [ ] Can add new client
- [ ] Matching algorithm works
- [ ] Can send test match email

---

## Phase 6: Security (5 min)

- [ ] Change admin password immediately:
  - Login → Settings → Change Password
- [ ] Rotate default credentials if used
- [ ] Enable Vercel password protection (if private app):
  - Settings → Deployment Protection
- [ ] Review Supabase logs for suspicious activity

---

## Troubleshooting Quick Fixes

### Build Failed?
```bash
# Check logs in Vercel dashboard
# Common issues:
# 1. Missing environment variables
# 2. Database connection timeout (use pooler URL)
# 3. Prisma generate failed (should auto-run)
```

### Can't Login?
- [ ] Verify `NEXTAUTH_SECRET` is set
- [ ] Verify `NEXTAUTH_URL` matches deployment URL
- [ ] Check Vercel logs for errors
- [ ] Verify database has seeded admin user

### Database Connection Error?
- [ ] Use connection POOLER string, not direct connection
- [ ] Format: `postgresql://postgres.[ref]:[password]@...pooler.supabase.com:6543/postgres?pgbouncer=true`
- [ ] Note the `:6543` port and `?pgbouncer=true` suffix

### Emails Not Sending?
- [ ] Verify 2FA enabled on Gmail
- [ ] Verify app password generated correctly (no spaces)
- [ ] Check `GMAIL_USER` and `GMAIL_APP_PASSWORD` in Vercel
- [ ] Test with a simple email first

---

## Optional: Custom Domain

- [ ] Add domain in Vercel → Settings → Domains
- [ ] Configure DNS records (A/CNAME)
- [ ] Wait for SSL certificate (automatic)
- [ ] Update `NEXTAUTH_URL` to custom domain
- [ ] Redeploy

---

## Success Criteria ✅

Your deployment is successful when:
- ✅ App loads at Vercel URL
- ✅ Admin can login
- ✅ Dashboard shows data
- ✅ Can create/edit clients
- ✅ Matching algorithm runs
- ✅ Emails send successfully
- ✅ Magic links work
- ✅ No console errors

---

## Estimated Time: 45-60 minutes

**You're done!** 🎉

Share your live URL: `https://your-app.vercel.app`

---

## Quick Commands Reference

```bash
# Generate secrets
openssl rand -base64 32  # NextAuth
openssl rand -hex 32     # Magic Link

# Database operations
npx prisma migrate deploy    # Run migrations
npx prisma db seed          # Seed database
npx prisma studio           # View database

# Vercel CLI (optional)
npm i -g vercel             # Install CLI
vercel                      # Deploy
vercel logs                 # View logs
```

---

## Need Help?

1. Check full guide: `VERCEL_SUPABASE_DEPLOYMENT.md`
2. Vercel Support: https://vercel.com/help
3. Supabase Support: https://supabase.com/dashboard/support
