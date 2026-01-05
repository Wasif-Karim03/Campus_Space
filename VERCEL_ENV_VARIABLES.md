# 🔐 Vercel Environment Variables - Ready to Copy

Copy and paste these into Vercel when setting up your project.

---

## Environment Variables for Vercel

Add these in: **Vercel Dashboard → Your Project → Settings → Environment Variables**

### 1. DATABASE_URL
```
postgresql://postgres:makeowugreatagain2026#@db.srnnltgqysghoeyjnydf.supabase.co:5432/postgres
```
- **Environment**: Select all (Production, Preview, Development)

### 2. NEXTAUTH_SECRET
```
TWNeseWA9aEYicGTiKlVa23CeSzYk2mcenNc/onMLjo=
```
- **Environment**: Select all (Production, Preview, Development)

### 3. NEXTAUTH_URL
```
https://campus-space.vercel.app
```
- **Note**: Update this after first deployment with your actual Vercel URL
- **Environment**: Select all (Production, Preview, Development)

### 4. GMAIL_EMAIL
```
campusspace6@gmail.com
```
- **Environment**: Select all (Production, Preview, Development)

### 5. GMAIL_APP_PASSWORD
```
[Your existing 16-character Gmail App Password]
```
- **Environment**: Select all (Production, Preview, Development)
- **Note**: Use the same app password you're using locally

---

## 📋 Step-by-Step: Adding to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import repository: **`Wasif-Karim03/Campus_Space`**
5. In the project setup page, scroll to **"Environment Variables"**
6. Click **"Add"** for each variable above
7. Copy and paste the values
8. Make sure to select **all environments** (Production, Preview, Development)
9. Click **"Save"** after each variable
10. After adding all 5 variables, scroll down and click **"Deploy"**

---

## ⚠️ Important Notes

- **Never commit these values to GitHub** - they're already in `.gitignore`
- **Keep your passwords secure** - don't share them publicly
- **Update NEXTAUTH_URL** after first deployment with your actual Vercel URL
- After updating NEXTAUTH_URL, you'll need to **redeploy** for it to take effect

---

## ✅ After First Deployment

1. Copy your actual Vercel URL (e.g., `https://campus-space-xxxxx.vercel.app`)
2. Go to **Settings → Environment Variables**
3. Find `NEXTAUTH_URL`
4. Click **"Edit"**
5. Update to your actual URL
6. Click **"Save"**
7. Go to **Deployments** tab
8. Click **"..."** on latest deployment → **"Redeploy"**

---

## 🎯 Next Steps After Adding Variables

1. Click **"Deploy"** button
2. Wait 2-3 minutes for build
3. Copy your Vercel URL
4. Update `NEXTAUTH_URL` with actual URL
5. Redeploy
6. Then run database setup (Step 5 in main guide)

