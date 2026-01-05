# 🚀 Complete Vercel Deployment Guide - Step by Step

This guide will walk you through deploying the OWU Room Booking System to Vercel so anyone can access it from anywhere.

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- ✅ GitHub account (your code is at: https://github.com/Wasif-Karim03/Campus_Space)
- ✅ Gmail account with 2-Step Verification enabled (for email verification codes)
- ✅ 30-45 minutes to complete the setup

---

## Step 1: Set Up Cloud Database (Supabase - Free)

You need a PostgreSQL database in the cloud. Supabase offers a free tier perfect for this.

### 1.1 Create Supabase Account
1. Go to **https://supabase.com**
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with your GitHub account (easiest)

### 1.2 Create New Project
1. Click **"New Project"**
2. Fill in:
   - **Name**: `campus-space` (or any name you like)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you (e.g., `US East`)
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be created

### 1.3 Get Database Connection String
1. Once project is ready, go to **Settings** (gear icon in left sidebar)
2. Click **"Database"** in the settings menu
3. Scroll down to **"Connection string"**
4. Select **"URI"** tab
5. Copy the connection string - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **Replace `[YOUR-PASSWORD]`** with the password you created in step 1.2
7. **Save this connection string** - you'll need it in Step 3

---

## Step 2: Create Vercel Account & Import Project

### 2.1 Sign Up for Vercel
1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub account

### 2.2 Import Your Repository
1. In Vercel dashboard, click **"Add New Project"**
2. You'll see your GitHub repositories
3. Find **"Campus_Space"** (or search for it)
4. Click **"Import"** next to it

### 2.3 Configure Project Settings
Vercel should auto-detect Next.js, but verify:
- **Framework Preset**: Next.js (should be auto-selected)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `.next` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

**⚠️ DO NOT CLICK DEPLOY YET!** We need to set up environment variables first.

---

## Step 3: Configure Environment Variables

### 3.1 Add Environment Variables in Vercel
1. In the project configuration page, scroll down to **"Environment Variables"**
2. Click **"Add"** or the **"+"** button
3. Add each variable one by one:

#### Variable 1: DATABASE_URL
- **Name**: `DATABASE_URL`
- **Value**: Paste your Supabase connection string from Step 1.3
- **Environment**: Select all (Production, Preview, Development)
- Click **"Save"**

#### Variable 2: NEXTAUTH_SECRET
- **Name**: `NEXTAUTH_SECRET`
- **Value**: `TWNeseWA9aEYicGTiKlVa23CeSzYk2mcenNc/onMLjo=`
  (This is a secure random key generated for you)
- **Environment**: Select all (Production, Preview, Development)
- Click **"Save"**

#### Variable 3: NEXTAUTH_URL
- **Name**: `NEXTAUTH_URL`
- **Value**: `https://campus-space.vercel.app` (or your project name)
  - **Note**: You'll get the actual URL after first deployment, then update this
- **Environment**: Select all (Production, Preview, Development)
- Click **"Save"**

#### Variable 4: GMAIL_EMAIL
- **Name**: `GMAIL_EMAIL`
- **Value**: Your Gmail address (e.g., `campusspace6@gmail.com`)
- **Environment**: Select all (Production, Preview, Development)
- Click **"Save"**

#### Variable 5: GMAIL_APP_PASSWORD
- **Name**: `GMAIL_APP_PASSWORD`
- **Value**: Your 16-character Gmail App Password
  - If you don't have one, see "Gmail App Password Setup" below
- **Environment**: Select all (Production, Preview, Development)
- Click **"Save"**

### 3.2 Gmail App Password Setup (If Needed)
1. Go to **https://myaccount.google.com/security**
2. Make sure **2-Step Verification** is enabled
3. Scroll to **"App passwords"**
4. Click **"App passwords"**
5. Select:
   - **App**: Mail
   - **Device**: Other (Custom name)
   - **Name**: Campus Space
6. Click **"Generate"**
7. Copy the 16-character password (remove spaces)
8. Use it as `GMAIL_APP_PASSWORD` in Vercel

---

## Step 4: Deploy to Vercel

### 4.1 Initial Deployment
1. Scroll to the bottom of the project configuration page
2. Click **"Deploy"**
3. Wait 2-3 minutes for the build to complete
4. You'll see a success message with your URL: `https://campus-space-xxxxx.vercel.app`

### 4.2 Update NEXTAUTH_URL
1. Copy your actual Vercel URL
2. Go to **Project Settings** → **Environment Variables**
3. Find `NEXTAUTH_URL`
4. Click **"Edit"**
5. Update the value to your actual Vercel URL (e.g., `https://campus-space-xxxxx.vercel.app`)
6. Click **"Save"**
7. Go to **Deployments** tab
8. Click the **"..."** menu on the latest deployment
9. Click **"Redeploy"** to apply the change

---

## Step 5: Set Up Database Schema

After deployment, you need to create the database tables.

### 5.1 Install Vercel CLI (One-time)
Open your terminal and run:
```bash
npm install -g vercel
```

### 5.2 Link to Your Project
```bash
cd /Users/wasifkarim/Desktop/OWU-Room-Khokon-main
vercel login
vercel link
```
- When prompted, select your Vercel account
- Select the `Campus_Space` project
- Use default settings

### 5.3 Pull Environment Variables
```bash
vercel env pull .env.local
```

### 5.4 Run Database Migrations
```bash
# Generate Prisma client
npm run db:generate

# Push database schema to Supabase
npx prisma db push
```

### 5.5 Seed Database (Optional but Recommended)
This adds sample rooms and initial data:
```bash
npm run db:seed
```

---

## Step 6: Verify Deployment

### 6.1 Test Your Live Site
1. Open your Vercel URL: `https://campus-space-xxxxx.vercel.app`
2. You should see the login page
3. Try signing in with email verification

### 6.2 Test Admin Login
1. Go to `/login`
2. Click **"Admin Login"**
3. Use:
   - **Email**: `admin@owu.edu`
   - **Password**: `admin123`

### 6.3 Test Room Booking
1. Sign in as a regular user
2. Browse rooms
3. Try booking a room
4. Verify it shows as "Booked" on the schedule

---

## Step 7: Post-Deployment Checklist

- [ ] Database schema created successfully
- [ ] Can access the live site
- [ ] Email verification codes are being sent
- [ ] Admin login works
- [ ] Room booking works
- [ ] Bookings show correctly on schedule
- [ ] Mobile view works properly

---

## 🔄 Automatic Deployments

Once set up, Vercel will automatically:
- ✅ Deploy every time you push to `main` branch on GitHub
- ✅ Create preview deployments for pull requests
- ✅ Run builds automatically

**To update your live site:**
1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. Vercel will automatically deploy in 2-3 minutes!

---

## 🐛 Troubleshooting

### Build Fails
- Check **Deployments** tab in Vercel for error logs
- Verify all environment variables are set correctly
- Make sure `DATABASE_URL` is correct

### Database Connection Errors
- Verify Supabase connection string is correct
- Check that you replaced `[YOUR-PASSWORD]` in the connection string
- Ensure Supabase project is active (not paused)

### Email Not Sending
- Verify `GMAIL_EMAIL` and `GMAIL_APP_PASSWORD` are correct
- Check Gmail App Password is valid (regenerate if needed)
- Check Vercel function logs for email errors

### Authentication Not Working
- Verify `NEXTAUTH_URL` matches your actual Vercel URL
- Check `NEXTAUTH_SECRET` is set
- Redeploy after changing environment variables

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Project Issues**: Check the GitHub repository

---

## 🎉 You're Done!

Your OWU Room Booking System is now live and accessible to anyone, anywhere!

**Your live URL**: `https://campus-space-xxxxx.vercel.app`

Share this URL with anyone who needs to use the system!

