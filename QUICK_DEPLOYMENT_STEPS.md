# ⚡ Quick Deployment Reference

## 🎯 Quick Steps Summary

### 1. Database Setup (5 min)
1. Go to https://supabase.com → Sign up
2. Create new project → Save password
3. Settings → Database → Copy connection string
4. Replace `[YOUR-PASSWORD]` with your actual password

### 2. Vercel Setup (10 min)
1. Go to https://vercel.com → Sign up with GitHub
2. Import repository: `Wasif-Karim03/Campus_Space`
3. Add environment variables (see below)
4. Click "Deploy"

### 3. Environment Variables (Copy & Paste)

Add these in Vercel → Project Settings → Environment Variables:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
NEXTAUTH_SECRET=TWNeseWA9aEYicGTiKlVa23CeSzYk2mcenNc/onMLjo=
NEXTAUTH_URL=https://your-app-name.vercel.app
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

### 4. Database Schema (5 min)
```bash
npm install -g vercel
vercel login
vercel link
vercel env pull .env.local
npm run db:generate
npx prisma db push
npm run db:seed
```

### 5. Update NEXTAUTH_URL
1. Copy your actual Vercel URL after first deploy
2. Update `NEXTAUTH_URL` in Vercel environment variables
3. Redeploy

---

## ✅ That's It!

Your app will be live at: `https://your-app-name.vercel.app`

For detailed instructions, see: `VERCEL_DEPLOYMENT_GUIDE.md`

