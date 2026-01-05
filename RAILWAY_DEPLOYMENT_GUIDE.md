# 🚂 Complete Railway Deployment Guide

Since you're already using Railway, this is perfect! Railway can host both your Next.js app AND your database in one place.

---

## 🎯 What You'll Set Up

1. **PostgreSQL Database** (on Railway) - Replace Supabase
2. **Next.js Application** (on Railway)
3. **Environment Variables** (configured in Railway)

---

## Step 1: Create PostgreSQL Database on Railway

### 1.1 Create New Database
1. Go to https://railway.app
2. Click **"New Project"** (or open existing project)
3. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
4. Railway will create a PostgreSQL database automatically
5. Wait 1-2 minutes for it to provision

### 1.2 Get Database Connection String
1. Click on your PostgreSQL service
2. Go to **"Variables"** tab
3. Find **`DATABASE_URL`** or **`POSTGRES_URL`**
4. Copy the connection string
   - It looks like: `postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway`
5. **Save this** - you'll need it in Step 3

---

## Step 2: Deploy Next.js App to Railway

### 2.1 Add Your App
1. In your Railway project, click **"+ New"**
2. Select **"GitHub Repo"**
3. Find and select: **`Wasif-Karim03/Campus_Space`**
4. Railway will automatically detect it's a Next.js app

### 2.2 Configure Build Settings
Railway should auto-detect, but verify:
- **Build Command**: `npm run build` (auto-detected)
- **Start Command**: `npm start` (auto-detected)
- **Root Directory**: `./` (default)

---

## Step 3: Set Up Environment Variables

### 3.1 Add Environment Variables
1. Click on your **Next.js service** in Railway
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add each variable:

#### Variable 1: DATABASE_URL
- **Name**: `DATABASE_URL`
- **Value**: Paste the PostgreSQL connection string from Step 1.2
- Click **"Add"**

#### Variable 2: NEXTAUTH_SECRET
- **Name**: `NEXTAUTH_SECRET`
- **Value**: `TWNeseWA9aEYicGTiKlVa23CeSzYk2mcenNc/onMLjo=`
- Click **"Add"**

#### Variable 3: NEXTAUTH_URL
- **Name**: `NEXTAUTH_URL`
- **Value**: `https://your-app-name.up.railway.app`
  - **Note**: You'll get the actual URL after first deploy, then update this
- Click **"Add"**

#### Variable 4: GMAIL_EMAIL
- **Name**: `GMAIL_EMAIL`
- **Value**: `campusspace6@gmail.com`
- Click **"Add"**

#### Variable 5: GMAIL_APP_PASSWORD
- **Name**: `GMAIL_APP_PASSWORD`
- **Value**: `ferpnljadnlcqswk`
- Click **"Add"**
- **Note**: Gmail SMTP often has connection issues on Railway. Consider using Resend instead (see Step 3.3 below).

#### Variable 6: RESEND_API_KEY (Recommended - Better than Gmail for Railway)
- **Name**: `RESEND_API_KEY`
- **Value**: Get from https://resend.com (see Step 3.3 below)
- **Note**: Resend is recommended for Railway as it doesn't have SMTP port blocking issues. Free tier: 3,000 emails/month.
- Click **"Add"** (if using Resend)

#### Variable 7: RESEND_FROM_EMAIL (Optional - if using Resend)
- **Name**: `RESEND_FROM_EMAIL`
- **Value**: Your verified email or domain (e.g., `noreply@yourdomain.com`)
- **Note**: Only needed if using Resend. Can use default `onboarding@resend.dev` for testing.
- Click **"Add"** (if using Resend)

#### Variable 8: REDIS_URL (Optional - Recommended for Production)
- **Name**: `REDIS_URL`
- **Value**: See Step 3.2 below for how to get this
- **Note**: Redis is **optional**. The app will work without it using in-memory storage for verification codes. However, Redis is recommended for production to handle multiple server instances and better performance.
- Click **"Add"** (only if setting up Redis)

---

### 3.2 Set Up Redis (Optional but Recommended)

**⚠️ Important**: Redis is **optional**. Your app will work fine without it. However, if you want better performance and to support multiple server instances, follow these steps:

#### Option A: Add Redis Service on Railway (Recommended)
1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add Redis"**
3. Wait 1-2 minutes for Redis to provision
4. Click on your Redis service
5. Go to **"Variables"** tab
6. Find **`REDIS_URL`** - it looks like: `redis://default:password@containers-us-west-xxx.railway.app:6379`
7. Copy the `REDIS_URL` value
8. Go back to your **Next.js service** → **"Variables"** tab
9. Add or update the `REDIS_URL` variable with the value from step 7

#### Option B: Use External Redis Service
- You can use services like **Upstash** (free tier available) or **Redis Cloud**
- Get the connection URL from your provider
- Add it as `REDIS_URL` in your Next.js service variables

#### Option C: Skip Redis (App Will Still Work)
- **Don't add any Redis variables**
- The app will use in-memory storage for verification codes
- This works fine for single-instance deployments
- **Note**: Verification codes will be lost if the server restarts

**What Redis is used for:**
- Storing verification codes (with fallback to memory)
- Caching room availability data (optional)
- Rate limiting (optional, fails open without Redis)

---

### 3.3 Set Up Resend Email (Recommended for Railway)

**⚠️ Important**: Gmail SMTP often has connection timeout issues on Railway. Resend is recommended as it works reliably on Railway.

**Why Resend?**
- ✅ Works perfectly on Railway (no SMTP port blocking)
- ✅ Free tier: 3,000 emails/month
- ✅ Better deliverability (emails don't go to spam)
- ✅ Easy setup (just an API key)

**Quick Setup:**
1. Go to https://resend.com and sign up (free)
2. Get your API key from the dashboard (starts with `re_`)
3. Add `RESEND_API_KEY` to your Railway variables (see Variable 6 above)
4. Optionally add `RESEND_FROM_EMAIL` if you have a verified domain
5. Redeploy your app

**Detailed Instructions**: See `RESEND_SETUP.md` for complete step-by-step guide.

**Email Service Priority:**
The app will try in this order:
1. Resend (if `RESEND_API_KEY` is set) ← Recommended
2. Gmail SMTP (if Resend fails and Gmail credentials are set)
3. Console logging (if neither is configured)

---

## Step 4: Deploy

### 4.1 Initial Deployment
1. Railway will automatically start deploying
2. Watch the build logs in the **"Deployments"** tab
3. Wait 2-3 minutes for the build to complete
4. Once done, you'll get a URL like: `https://campus-space-production.up.railway.app`

### 4.2 Update NEXTAUTH_URL
1. Copy your actual Railway URL
2. Go to your service → **"Variables"** tab
3. Find `NEXTAUTH_URL`
4. Click **"Edit"**
5. Update to your actual Railway URL
6. Railway will automatically redeploy

---

## Step 5: Set Up Database Schema

After first deployment, you need to create the database tables.

### 5.1 Option A: Using Railway CLI (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Pull environment variables
railway variables

# Generate Prisma client
npm run db:generate

# Push database schema
npx prisma db push

# Seed database (optional)
npm run db:seed
```

### 5.2 Option B: Using Railway Database Dashboard
1. Go to your PostgreSQL service in Railway
2. Click **"Query"** tab
3. You can run SQL commands directly
4. Or use Prisma Studio:
   ```bash
   railway variables
   npx prisma studio
   ```

---

## Step 6: Verify Deployment

### 6.1 Test Your Live Site
1. Open your Railway URL: `https://your-app.up.railway.app`
2. You should see the login page
3. Try signing in with email verification

### 6.2 Test Admin Login
1. Go to `/login`
2. Click **"Admin Login"**
3. Use:
   - **Email**: `admin@owu.edu`
   - **Password**: `admin123`

---

## 🎯 Advantages of Using Railway

✅ **Everything in One Place**
   - App and database in same project
   - Easy to manage

✅ **Simple Interface**
   - Clean dashboard
   - Easy to understand

✅ **Automatic Deployments**
   - Deploys on every GitHub push
   - Just like Vercel

✅ **Free Tier**
   - $5/month credit
   - Usually enough for small projects

✅ **Built-in Database**
   - No need for separate Supabase account
   - Database and app together

---

## 🔄 Migration from Supabase to Railway Postgres

If you want to move from Supabase to Railway Postgres:

1. **Export data from Supabase** (if you have any)
2. **Create Railway Postgres** (Step 1 above)
3. **Update DATABASE_URL** in Railway variables
4. **Run migrations**: `npx prisma db push`
5. **Import data** (if needed)

---

## 📋 Post-Deployment Checklist

- [ ] Database created on Railway
- [ ] App deployed successfully
- [ ] All environment variables set
- [ ] NEXTAUTH_URL updated with actual Railway URL
- [ ] Database schema created (`npx prisma db push`)
- [ ] Database seeded (optional: `npm run db:seed`)
- [ ] Can access live site
- [ ] Email verification works
- [ ] Admin login works
- [ ] Room booking works

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Verify all environment variables are set
- Make sure `DATABASE_URL` is correct

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Check PostgreSQL service is running
- Ensure database is provisioned (wait 1-2 min)

### App Not Starting
- Check runtime logs in Railway
- Verify `NEXTAUTH_URL` matches your Railway URL
- Check all environment variables are set

---

## 💡 Pro Tips

1. **Use Railway's built-in PostgreSQL** - No need for Supabase
2. **Monitor usage** - Railway shows your $5 credit usage
3. **Check logs** - Railway has great logging interface
4. **Automatic HTTPS** - Railway provides SSL automatically
5. **Custom domains** - You can add your own domain later

---

## 🎉 You're Done!

Your OWU Room Booking System is now live on Railway!

**Your live URL**: `https://your-app.up.railway.app`

Share this URL with anyone who needs to use the system!

---

## 📞 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Project Issues**: Check the GitHub repository

