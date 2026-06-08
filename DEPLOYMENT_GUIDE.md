# TDC Matchmaker - Complete Deployment Guide

## 🎯 Deployment Overview

This guide covers deploying the TDC Matchmaker to production using:
- **Vercel** (Frontend & API)
- **AWS RDS** (PostgreSQL Database)
- **AWS ElastiCache** (Redis Cache)
- **AWS S3** (Profile Photos)

---

## 📋 Pre-Deployment Checklist

Before starting, ensure you have:
- [ ] GitHub account
- [ ] Vercel account (free tier works)
- [ ] AWS account with billing enabled
- [ ] Google Gemini API key
- [ ] Gmail account for SMTP

---

## Part 1: Setup AWS Infrastructure

### Step 1.1: Create PostgreSQL Database (AWS RDS)

1. **Go to AWS RDS Console**
   - Navigate to: https://console.aws.amazon.com/rds/

2. **Create Database**
   - Click "Create database"
   - Engine: **PostgreSQL**
   - Version: **PostgreSQL 15.x or later**
   - Templates: **Free tier** (or Production for real use)

3. **Settings**
   - DB instance identifier: `tdc-matchmaker-db`
   - Master username: `postgres`
   - Master password: Create strong password (save this!)

4. **DB Instance Size**
   - Free tier: `db.t3.micro` (1 vCPU, 1 GB RAM)
   - Production: `db.t3.small` or higher

5. **Storage**
   - Allocated storage: 20 GB minimum
   - Storage type: General Purpose (SSD)
   - Enable storage autoscaling: Yes
   - Maximum storage threshold: 100 GB

6. **Connectivity**
   - Public access: **Yes** (for Vercel to connect)
   - VPC security group: Create new
   - Security group name: `tdc-matchmaker-sg`

7. **Additional Configuration**
   - Initial database name: `tdc_matchmaker`
   - Backup retention: 7 days
   - Enable encryption: Yes

8. **Create Database** (takes 5-10 minutes)

9. **Configure Security Group**
   - Go to EC2 > Security Groups
   - Find `tdc-matchmaker-sg`
   - Edit Inbound Rules
   - Add Rule:
     - Type: PostgreSQL
     - Protocol: TCP
     - Port: 5432
     - Source: `0.0.0.0/0` (Anywhere - for Vercel)
     - Description: "Allow Vercel connections"

10. **Get Connection String**
    - Go to RDS > Databases > `tdc-matchmaker-db`
    - Copy the Endpoint (e.g., `tdc-matchmaker-db.xxx.rds.amazonaws.com`)
    - Format: `postgresql://postgres:YOUR_PASSWORD@tdc-matchmaker-db.xxx.rds.amazonaws.com:5432/tdc_matchmaker`

### Step 1.2: Create Redis Cache (AWS ElastiCache)

1. **Go to ElastiCache Console**
   - Navigate to: https://console.aws.amazon.com/elasticache/

2. **Create Redis Cluster**
   - Click "Create"
   - Engine: **Redis**
   - Location: AWS Cloud
   - Deployment option: **Serverless** (easiest) or **Design your own cache**

3. **Serverless Option** (Recommended for simplicity)
   - Name: `tdc-matchmaker-redis`
   - Description: "Redis cache for TDC Matchmaker"
   - Maximum data storage: 1 GB (free tier)
   - Maximum ECPUs per second: 5000

4. **Security**
   - Select VPC: Same VPC as RDS
   - Security group: Use same `tdc-matchmaker-sg`
   - Encryption: Enable at-rest and in-transit

5. **Advanced Settings**
   - Snapshot retention: 1 day
   - Data tiering: Disabled

6. **Create** (takes 10-15 minutes)

7. **Get Connection String**
   - Go to Redis > Serverless caches > `tdc-matchmaker-redis`
   - Copy Primary Endpoint
   - Format: `redis://default:PASSWORD@tdc-matchmaker-redis.xxx.cache.amazonaws.com:6379`
   - Note: If no password is set, use: `redis://tdc-matchmaker-redis.xxx.cache.amazonaws.com:6379`

### Step 1.3: Create S3 Bucket for Photos

1. **Go to S3 Console**
   - Navigate to: https://s3.console.aws.amazon.com/

2. **Create Bucket**
   - Click "Create bucket"
   - Bucket name: `tdc-matchmaker-photos` (must be globally unique)
   - Region: **ap-south-1** (Mumbai) or nearest to you

3. **Object Ownership**
   - ACLs disabled (recommended)

4. **Block Public Access**
   - **Uncheck** "Block all public access"
   - Acknowledge warning (we need public read for photos)

5. **Bucket Versioning**
   - Enable versioning: Optional

6. **Default Encryption**
   - Enable server-side encryption
   - Encryption key type: Amazon S3 managed keys (SSE-S3)

7. **Create Bucket**

8. **Configure CORS**
   - Go to bucket > Permissions > CORS
   - Add this configuration:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": ["ETag"]
     }
   ]
   ```

9. **Configure Bucket Policy**
   - Go to bucket > Permissions > Bucket policy
   - Add this policy (replace `YOUR-BUCKET-NAME`):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
       }
     ]
   }
   ```

### Step 1.4: Create IAM User for S3 Access

1. **Go to IAM Console**
   - Navigate to: https://console.aws.amazon.com/iam/

2. **Create User**
   - Click "Users" > "Create user"
   - User name: `tdc-matchmaker-s3-user`
   - Access type: Programmatic access

3. **Set Permissions**
   - Attach policies directly
   - Select **AmazonS3FullAccess** (or create custom policy for specific bucket)

4. **Create User**

5. **Save Credentials**
   - **Access Key ID**: Save this
   - **Secret Access Key**: Save this (only shown once!)

---

## Part 2: Setup External Services

### Step 2.1: Get Google Gemini API Key

1. **Go to Google AI Studio**
   - Navigate to: https://aistudio.google.com/

2. **Sign in with Google Account**

3. **Get API Key**
   - Click "Get API Key"
   - Create new API key or use existing project
   - Copy the API key (starts with `AIza...`)

4. **Save API Key** for later use

### Step 2.2: Setup Gmail SMTP

1. **Enable 2-Step Verification**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification if not already enabled

2. **Create App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: Mail
   - Select device: Other (Custom name)
   - Name: "TDC Matchmaker"
   - Generate

3. **Copy 16-character App Password** (e.g., `abcd efgh ijkl mnop`)
   - Remove spaces: `abcdefghijklmnop`

4. **Save for Environment Variables:**
   - GMAIL_USER: your email (e.g., `your-email@gmail.com`)
   - GMAIL_APP_PASSWORD: the 16-character password

---

## Part 3: Push Code to GitHub

### Step 3.1: Initialize Git Repository

```bash
# If not already initialized
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - TDC Matchmaker with BYvowed theme"
```

### Step 3.2: Create GitHub Repository

1. **Go to GitHub**
   - Navigate to: https://github.com/new

2. **Create New Repository**
   - Repository name: `tdc-matchmaker`
   - Description: "TDC Matchmaker Dashboard - Internal CRM Tool"
   - Visibility: **Private** (recommended for internal tool)
   - Do NOT initialize with README (you already have one)

3. **Create Repository**

### Step 3.3: Push to GitHub

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/tdc-matchmaker.git

# Push code
git branch -M main
git push -u origin main
```

---

## Part 4: Deploy to Vercel

### Step 4.1: Connect Vercel to GitHub

1. **Go to Vercel**
   - Navigate to: https://vercel.com/

2. **Sign Up / Login**
   - Login with GitHub account

3. **Import Project**
   - Click "Add New..." > "Project"
   - Select your GitHub repository: `tdc-matchmaker`
   - Click "Import"

### Step 4.2: Configure Project Settings

1. **Framework Preset**
   - Should auto-detect: **Next.js**

2. **Root Directory**
   - Leave as default (root)

3. **Build Command**
   - Default: `npm run build`

4. **Output Directory**
   - Default: `.next`

5. **Install Command**
   - Default: `npm install`

### Step 4.3: Add Environment Variables

Click "Environment Variables" and add ALL of these:

#### Database
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@tdc-matchmaker-db.xxx.rds.amazonaws.com:5432/tdc_matchmaker?schema=public
```

#### NextAuth
```
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET
NEXTAUTH_URL=https://your-app.vercel.app
```
Generate secret with: `openssl rand -base64 32`

#### Google Gemini
```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

#### Gmail SMTP
```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

#### Magic Link
```
MAGIC_LINK_SECRET=YOUR_GENERATED_SECRET
```
Generate with: `openssl rand -hex 32`

#### AWS Configuration
```
AWS_ACCESS_KEY_ID=YOUR_IAM_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_IAM_SECRET_KEY
AWS_S3_BUCKET=tdc-matchmaker-photos
AWS_REGION=ap-south-1
```

#### Redis
```
REDIS_URL=redis://default:PASSWORD@tdc-matchmaker-redis.xxx.cache.amazonaws.com:6379
```

### Step 4.4: Deploy

1. **Click "Deploy"**
   - Vercel will build and deploy your application
   - Takes 2-5 minutes

2. **Wait for Deployment to Complete**

3. **Get Production URL**
   - Copy the URL (e.g., `https://tdc-matchmaker.vercel.app`)

### Step 4.5: Update NEXTAUTH_URL

1. **Go to Vercel Dashboard**
   - Project Settings > Environment Variables

2. **Edit NEXTAUTH_URL**
   - Change from placeholder to actual URL
   - Example: `https://tdc-matchmaker.vercel.app`

3. **Redeploy**
   - Go to Deployments
   - Click "..." on latest deployment
   - Click "Redeploy"

---

## Part 5: Database Setup

### Step 5.1: Run Prisma Migrations

You need to run this from your local machine:

```bash
# Make sure DATABASE_URL is set in your local .env
# Then run migrations against production database

npx prisma migrate deploy
```

**Alternative**: Use Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migration with production env
DATABASE_URL=your_production_db_url npx prisma migrate deploy
```

### Step 5.2: Seed Database (Optional)

If you want demo data in production:

```bash
# Local method
DATABASE_URL=your_production_db_url npx prisma db seed
```

This creates:
- 1 matchmaker account (admin@tdc.com / tdc@2025)
- 100 dummy client profiles

**⚠️ Warning**: Only do this for testing. Delete dummy data before real use.

### Step 5.3: Verify Database Connection

1. **Open Prisma Studio**
   ```bash
   DATABASE_URL=your_production_db_url npx prisma studio
   ```

2. **Check Tables**
   - Matchmaker (should have 1 record if seeded)
   - Client (should have 100 records if seeded)
   - Match (empty initially)
   - Note (empty initially)

---

## Part 6: Test Production Deployment

### Step 6.1: Test Authentication

1. **Visit Production URL**
   - Example: https://tdc-matchmaker.vercel.app

2. **Click "Get Started"**
   - Should redirect to `/login`

3. **Login with Default Credentials**
   - Email: `admin@tdc.com`
   - Password: `tdc@2025`
   - (Change this after first login!)

4. **Should redirect to `/dashboard`**

### Step 6.2: Test Client Management

1. **Dashboard**
   - Should see Kanban board with clients
   - Should see statistics cards

2. **Clients Page**
   - Should see client table
   - Click "Add Client" - test form

3. **Client Detail Page**
   - Click "View" on any client
   - Should see biodata card
   - Should see notes panel

### Step 6.3: Test Matching Engine

1. **Go to Client Detail Page**

2. **Click "Find Compatible Matches"**
   - Should show loading animation
   - Should call Gemini API
   - Should display match results

3. **Verify Match Display**
   - Top 3 podium matches
   - Remaining matches in accordion
   - Match history table

### Step 6.4: Test Email System

1. **Send a Test Match**
   - Click "Send Match" on any high-scoring match
   - Should generate email preview
   - Click "Send Match"

2. **Check Email Delivery**
   - Check recipient's inbox
   - Email should arrive within 1-2 minutes

3. **Test Magic Link**
   - Click magic link in email
   - Should open client portal
   - Test "Interested" / "Not Interested" buttons

### Step 6.5: Test Public Onboarding

1. **Visit Onboarding URL**
   - Example: https://tdc-matchmaker.vercel.app/onboard

2. **Fill Out Form**
   - Test all fields
   - Upload photo (tests S3)
   - Submit

3. **Verify Client Created**
   - Check dashboard
   - Should see new client in "NEW" column

---

## Part 7: Production Hardening

### Step 7.1: Change Default Password

1. **Login as Admin**

2. **Go to Settings**
   - Change password from `tdc@2025` to strong password
   - Save changes

### Step 7.2: Create Additional Matchmaker Accounts

You'll need to do this via Prisma Studio or API:

```typescript
// Use Prisma Studio or create API endpoint
// Password should be bcrypt hashed

import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash('new-secure-password', 10);

// Create matchmaker in database with hashed password
```

### Step 7.3: Enable AWS Backups

**RDS Automated Backups**
- Go to RDS > Databases > Modify
- Backup retention period: 7-30 days
- Backup window: Set preferred time
- Apply changes

**S3 Versioning**
- Go to S3 bucket > Properties
- Enable versioning
- Configure lifecycle rules

### Step 7.4: Setup Monitoring

**Vercel Analytics**
- Go to Vercel Dashboard > Analytics
- Enable Web Analytics (free)
- Enable Speed Insights

**AWS CloudWatch**
- RDS: Enable Enhanced Monitoring
- ElastiCache: Enable CloudWatch metrics
- S3: Enable request metrics

### Step 7.5: Configure Custom Domain (Optional)

1. **Purchase Domain**
   - Example: `matchmaker.thedatecrew.com`

2. **Add Domain in Vercel**
   - Project Settings > Domains
   - Add domain
   - Follow DNS configuration instructions

3. **Update NEXTAUTH_URL**
   - Change to custom domain
   - Redeploy

---

## Part 8: Maintenance & Scaling

### Database Scaling

**When to Scale RDS:**
- CPU utilization > 70% consistently
- Connection count near max_connections
- Storage > 80% full

**How to Scale:**
- Vertical: Change instance class (e.g., db.t3.small → db.t3.medium)
- Storage: Increase allocated storage
- Read Replicas: Add for read-heavy workloads

### Redis Scaling

**ElastiCache Serverless** scales automatically

**For Node-based clusters:**
- Add more nodes
- Increase node size
- Enable cluster mode

### Cost Optimization

**Free Tier Resources:**
- Vercel: Free for hobby projects
- RDS: 750 hours/month db.t3.micro (12 months)
- ElastiCache: Some serverless usage included
- S3: 5 GB storage, 20,000 GET requests

**Estimated Monthly Costs (After Free Tier):**
- RDS db.t3.micro: ~$15-20/month
- ElastiCache Serverless (1 GB): ~$10-15/month
- S3 (10 GB + transfers): ~$2-5/month
- **Total**: ~$27-40/month

---

## 🚨 Troubleshooting

### Issue: "Database connection failed"

**Solution:**
1. Check RDS security group allows 0.0.0.0/0 on port 5432
2. Verify DATABASE_URL is correct in Vercel
3. Check RDS instance is running
4. Test connection with: `psql $DATABASE_URL`

### Issue: "Redis connection timeout"

**Solution:**
1. Check ElastiCache security group
2. Verify REDIS_URL format
3. Ensure ElastiCache is in same region
4. Check VPC configuration

### Issue: "S3 upload failed"

**Solution:**
1. Verify IAM user has S3 permissions
2. Check bucket policy allows public read
3. Verify AWS credentials in Vercel
4. Check CORS configuration

### Issue: "Email not sending"

**Solution:**
1. Verify Gmail App Password is correct (no spaces)
2. Check 2-Step Verification is enabled
3. Try generating new App Password
4. Check Vercel logs for error messages

### Issue: "Build failed on Vercel"

**Solution:**
1. Check build logs for errors
2. Verify all dependencies in package.json
3. Ensure DATABASE_URL is set (Prisma needs it at build time)
4. Try `npm run build` locally first

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **AWS RDS Guide**: https://docs.aws.amazon.com/rds/
- **AWS S3 Guide**: https://docs.aws.amazon.com/s3/

---

## ✅ Deployment Complete!

Your TDC Matchmaker is now live in production! 🎉

**Next Steps:**
1. Share URL with matchmakers
2. Train staff on using the system
3. Start onboarding real clients
4. Monitor performance and costs
5. Gather feedback for improvements

**Production URL**: https://your-app.vercel.app
**Admin Login**: admin@tdc.com (change password!)

---

**Last Updated**: June 7, 2026
**Deployment Platform**: Vercel + AWS
**Status**: Production Ready ✓
