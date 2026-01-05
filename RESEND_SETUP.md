# 📧 Resend Email Setup Guide

Resend is a modern email API that works perfectly with Railway and other cloud platforms. It's much more reliable than Gmail SMTP for production deployments.

---

## 🎯 Why Resend?

- ✅ **Works on Railway** - No SMTP port blocking issues
- ✅ **Free Tier** - 3,000 emails/month free
- ✅ **Fast & Reliable** - Built for developers
- ✅ **Easy Setup** - Just need an API key
- ✅ **Better Deliverability** - Emails don't go to spam

---

## Step 1: Sign Up for Resend

1. Go to https://resend.com
2. Click **"Sign Up"** (or "Get Started")
3. Sign up with your email or GitHub account
4. Verify your email address

---

## Step 2: Get Your API Key

1. After signing in, you'll be taken to the Resend dashboard
2. Click on **"API Keys"** in the left sidebar
3. Click **"+ Create API Key"** button
4. Give it a name (e.g., "Room Booking System")
5. Select **"Sending access"** (default)
6. Click **"Add"**
7. **Copy the API key** - it starts with `re_` (you won't see it again!)
   - Example: `re_123456789abcdefghijklmnop`

⚠️ **Important**: Save this API key - you'll need it in the next step!

---

## Step 3: Add Domain (Optional but Recommended)

For production, you should add your own domain:

1. Go to **"Domains"** in the Resend dashboard
2. Click **"+ Add Domain"**
3. Enter your domain (e.g., `owu.edu` or `campusspace.com`)
4. Follow the DNS setup instructions
5. Wait for verification (usually 5-10 minutes)

**For Quick Testing**: You can use Resend's default domain without verification, but emails might go to spam.

---

## Step 4: Add Environment Variables to Railway

1. **Go to Railway Dashboard**
   - Open your project
   - Click on your **Campus_Space** service

2. **Open Variables Tab**
   - Click on **"Variables"** tab

3. **Add RESEND_API_KEY**
   - Click **"+ New Variable"**
   - **Name**: `RESEND_API_KEY`
   - **Value**: Paste your Resend API key (from Step 2)
   - Click **"Add"**

4. **Add RESEND_FROM_EMAIL (Optional)**
   - Click **"+ New Variable"** again
   - **Name**: `RESEND_FROM_EMAIL`
   - **Value**: Your verified email or domain email
     - If you added a domain: `noreply@yourdomain.com`
     - If using default: `onboarding@resend.dev` (for testing)
   - Click **"Add"**

---

## Step 5: Redeploy Your App

1. Railway should automatically detect the new environment variable and redeploy
2. If not, go to **"Deployments"** tab
3. Click **"Redeploy"** on the latest deployment
4. Wait 2-3 minutes for deployment to complete

---

## Step 6: Test Email Sending

1. Go to your live app: `https://campusspace-production.up.railway.app`
2. Try to sign in with email verification
3. Check your email inbox (and spam folder)
4. You should receive the verification code!

---

## ✅ Verify It's Working

Check your Railway logs:

1. Go to **Campus_Space** → **"Deployments"** tab
2. Click on the latest deployment
3. Open **"Logs"**
4. Look for: `✅ Email sent successfully via Resend to [email]`

If you see this, Resend is working! 🎉

---

## 🔄 Fallback Behavior

The app is smart - it will try:
1. **Resend first** (if `RESEND_API_KEY` is set)
2. **Gmail SMTP** (if Resend fails and Gmail credentials are set)
3. **Console logging** (if neither is configured)

So your app will work even if Resend has issues!

---

## 📊 Resend Free Tier Limits

- **3,000 emails/month** - Free forever
- **100 emails/day** - Daily limit
- Perfect for small to medium applications

If you need more:
- **Pro Plan**: $20/month for 50,000 emails
- **Enterprise**: Custom pricing

---

## 🐛 Troubleshooting

### "Resend error" in logs
- Check that `RESEND_API_KEY` is set correctly in Railway
- Verify the API key is correct (starts with `re_`)
- Make sure you copied the entire key

### Emails not arriving
- Check spam folder
- Verify `RESEND_FROM_EMAIL` is set (or using default)
- Check Resend dashboard for delivery status
- Make sure your domain is verified (if using custom domain)

### Still using Gmail SMTP
- Check logs - if you see "Gmail SMTP" it means Resend failed
- Verify `RESEND_API_KEY` is set in Railway
- Redeploy after adding the variable

---

## 🎉 You're Done!

Your app now uses Resend for reliable email delivery on Railway!

**Benefits:**
- ✅ No more connection timeouts
- ✅ Better email deliverability
- ✅ Works perfectly on Railway
- ✅ Free tier is generous

---

## 📝 Environment Variables Summary

Add these to Railway:

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com  # Optional
```

**Note**: You can keep `GMAIL_EMAIL` and `GMAIL_APP_PASSWORD` as fallback, but Resend will be used first.

---

## 🔗 Useful Links

- **Resend Dashboard**: https://resend.com
- **Resend Docs**: https://resend.com/docs
- **Resend API Reference**: https://resend.com/docs/api-reference

---

## 💡 Pro Tips

1. **Use Your Own Domain**: Better deliverability and branding
2. **Monitor Usage**: Check Resend dashboard for email stats
3. **Set Up Webhooks**: Track email events (delivered, bounced, etc.)
4. **Keep Gmail as Backup**: The app will fallback if Resend fails

---

Need help? Check the Railway logs or Resend dashboard for detailed error messages!

