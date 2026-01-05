# 🚀 Step-by-Step: Adding Redis to Your Railway App

This guide will walk you through adding Redis to your Railway deployment to fix the connection errors and improve performance.

---

## 📋 Prerequisites

- You have a Railway account and project set up
- Your Next.js app is already deployed on Railway
- You have access to your Railway project dashboard

---

## 🎯 Step-by-Step Instructions

### Step 0: Understanding Your Railway Project Layout

**What you'll see in Railway:**
- Your **Project** contains multiple **Services**
- Each service is a separate application/service (like your Next.js app, PostgreSQL database, Redis, etc.)
- Services appear as cards/boxes in your project dashboard

**How to identify your Next.js service:**
- It's usually named after your GitHub repository (e.g., "Campus_Space" or "OWU-Room-Khokon")
- Or it might be named "Web Service" or "Next.js"
- It has a different icon than the database/Redis services
- It's the service that runs your actual application

**How to identify your Redis service:**
- Usually named "Redis" or has a Redis icon
- Recently added (if you just added it)
- Shows as a database/service type

---

### Step 1: Add Redis Service to Your Railway Project

1. **Go to Railway Dashboard**
   - Open https://railway.app in your browser
   - Log in to your account
   - Navigate to your project (the one with your Next.js app)
   - You should see a dashboard with multiple service cards/boxes

2. **Add Redis Database**
   - In your project dashboard, click the **"+ New"** button (usually in the top right or bottom of your services list)
   - A dropdown menu will appear
   - Select **"Database"** from the options
   - Then select **"Add Redis"** or **"Redis"**
   - Railway will start provisioning your Redis instance

3. **Wait for Provisioning**
   - You'll see a new service appear in your project
   - Wait 1-2 minutes for Railway to fully provision the Redis instance
   - The service status should show as "Active" or "Running" when ready

---

### Step 2: Get Your Redis Connection URL

1. **Open Redis Service**
   - Click on the **Redis service** in your Railway project (it will have a Redis icon/name)

2. **Navigate to Variables Tab**
   - Click on the **"Variables"** tab in the Redis service
   - This shows all environment variables for the Redis service

3. **Find the Redis Variables**
   - Railway provides these variables (you'll see template syntax like `${{VARIABLE}}`):
     - `REDIS_PASSWORD` - The actual password (e.g., `CZBpgRtJADDoiNhZfqACGFTpYPDTPcWG`)
     - `REDIS_URL` - Connection URL with template variables
     - `REDIS_PUBLIC_URL` - Public connection URL
     - `REDISHOST` - The Redis host
     - `REDISPORT` - The Redis port (usually 6379)
     - `REDISUSER` - The Redis user (usually "default")

4. **Construct the Redis URL**
   - You need to build the URL manually using the actual values
   - Format: `redis://default:REDIS_PASSWORD@REDISHOST:REDISPORT`
   - Example: `redis://default:CZBpgRtJADDoiNhZfqACGFTpYPDTPcWG@your-redis-host.railway.app:6379`
   - **Copy the actual password** from `REDIS_PASSWORD`
   - **Copy the host** from `REDISHOST` (it will be something like `containers-us-west-xxx.railway.app`)
   - **Use port** `6379` (from `REDISPORT`)

---

### Step 3: Add REDIS_URL to Your Next.js Service

**Option A: Reference Redis Service Variables (Recommended - Railway Auto-Resolves)**

1. **Find Your Next.js Service**
   - In your Railway project dashboard, you'll see multiple service cards
   - Look for the service that runs your application (not the database or Redis)
   - **How to identify it:**
     - It's usually the **first service** you added (your main app)
     - It might be named after your GitHub repo (e.g., "OWU-Room-Khokon" or "Campus_Space")
     - It might say "Web Service" or have a web/app icon
     - It's NOT the PostgreSQL database service
     - It's NOT the Redis service (which you just added)
   - **Click on this service card** to open it

2. **Open Variables Tab**
   - Click on the **"Variables"** tab in your Next.js service

3. **Add REDIS_URL by Referencing Redis Service**
   - Click **"+ New Variable"** or **"Add Variable"** button
   - In the **"Name"** field, enter: `REDIS_URL`
   - In the **"Value"** field, you have two options:
     
     **Option 1: Use Railway's Variable Reference (Best)**
     - Click the **"Reference"** button or select **"Reference Variable"**
     - Select your **Redis service** from the dropdown
     - Select **`REDIS_URL`** from the Redis service variables
     - Railway will automatically resolve the template variables
     - Click **"Add"** or **"Save"**
     
     **Option 2: Construct Manually**
     - Build the URL using the actual values from Step 2:
     - Format: `redis://default:REDIS_PASSWORD@REDISHOST:6379`
     - Replace `REDIS_PASSWORD` with the actual password value
     - Replace `REDISHOST` with the actual host value
     - Example: `redis://default:CZBpgRtJADDoiNhZfqACGFTpYPDTPcWG@containers-us-west-xxx.railway.app:6379`
     - Paste this into the **"Value"** field
     - Click **"Add"** or **"Save"**

4. **Verify the Variable**
   - You should now see `REDIS_URL` in your environment variables list
   - If you used Option 1 (Reference), Railway will show it as a reference
   - The resolved value should look like: `redis://default:password@host:6379`

---

### Step 4: Redeploy Your Application

1. **Trigger Redeployment**
   - Railway should automatically detect the new environment variable and trigger a redeploy
   - If not, you can manually trigger a redeploy:
     - Go to the **"Deployments"** tab
     - Click **"Redeploy"** on the latest deployment
     - Or make a small change to trigger a new deployment (like adding a comment to a file)

2. **Monitor the Deployment**
   - Watch the build logs in the **"Deployments"** tab
   - Wait for the deployment to complete (usually 2-3 minutes)
   - Check that the deployment status shows as "Success" or "Active"

---

### Step 5: Verify Redis Connection

1. **Check Application Logs**
   - Go to your Next.js service → **"Deployments"** tab
   - Click on the latest deployment
   - Open the **"Logs"** or **"View Logs"** section
   - Look for one of these messages:
     - ✅ **Success**: `✅ Redis connected` (this means Redis is working!)
     - ⚠️ **Warning**: `⚠️ Redis unavailable, using in-memory storage` (Redis not connected, but app still works)
     - ❌ **Error**: `Redis Client Error: ...` (connection issue - check your REDIS_URL)

2. **Test Verification Code**
   - Go to your live app URL
   - Try to sign in with email verification
   - The "sending verification code" should no longer get stuck
   - Check the logs - you should NOT see `ECONNREFUSED` errors anymore

---

## ✅ Success Indicators

You'll know Redis is working correctly when:

- ✅ No `ECONNREFUSED` errors in logs
- ✅ You see `✅ Redis connected` in the logs
- ✅ Email verification codes send without getting stuck
- ✅ No Redis connection errors in the Railway logs

---

## 🐛 Troubleshooting

### Problem: Can't find REDIS_URL in Redis service variables

**Solution:**
- Check if Railway uses a different variable name
- Look for `REDISCLOUD_URL`, `REDIS_HOST`, or connection strings
- You can also check the Redis service's "Connect" or "Info" tab for connection details

### Problem: Still seeing connection errors after adding REDIS_URL

**Solutions:**
1. **Verify the URL format:**
   - Should start with `redis://` or `rediss://`
   - Should include password, host, and port
   - Example: `redis://default:password@host:6379`

2. **Check for typos:**
   - Make sure there are no extra spaces
   - Ensure the entire URL was copied correctly
   - Don't add quotes around the URL

3. **Wait for redeploy:**
   - Environment variables take effect after redeployment
   - Make sure your app has been redeployed after adding REDIS_URL

4. **Check Redis service status:**
   - Make sure the Redis service is running (not paused or stopped)
   - Restart the Redis service if needed

### Problem: App works but Redis connection fails

**Solution:**
- The app is designed to work without Redis (using in-memory storage)
- This is fine for single-instance deployments
- If you want Redis for production, double-check your REDIS_URL format

### Problem: Railway doesn't have "Add Redis" option

**Solutions:**
1. **Check your Railway plan:**
   - Some plans may not include Redis
   - Consider upgrading or using external Redis (see Alternative below)

2. **Use External Redis Service:**
   - Sign up for **Upstash Redis** (free tier available): https://upstash.com
   - Or use **Redis Cloud**: https://redis.com/try-free/
   - Get the connection URL from your provider
   - Add it as `REDIS_URL` in your Next.js service

---

## 🔄 Alternative: Using External Redis (Upstash)

If Railway doesn't offer Redis or you prefer an external service:

1. **Sign up for Upstash** (Free tier available)
   - Go to https://upstash.com
   - Sign up for a free account
   - Create a new Redis database

2. **Get Connection URL**
   - In Upstash dashboard, go to your Redis database
   - Copy the **"REST URL"** or **"Redis URL"**
   - It will look like: `redis://default:password@usw1-xxx.upstash.io:6379`

3. **Add to Railway**
   - Go to your Next.js service on Railway
   - Add `REDIS_URL` variable with the Upstash URL
   - Redeploy your app

---

## 📝 Quick Checklist

- [ ] Redis service added to Railway project
- [ ] Redis service is running/active
- [ ] REDIS_URL copied from Redis service variables
- [ ] REDIS_URL added to Next.js service variables
- [ ] App redeployed after adding REDIS_URL
- [ ] Checked logs for "✅ Redis connected" message
- [ ] Tested email verification - no longer stuck
- [ ] No ECONNREFUSED errors in logs

---

## 🎉 You're Done!

Once you see `✅ Redis connected` in your logs and verification codes work without getting stuck, Redis is successfully configured!

Your app will now:
- ✅ Store verification codes in Redis (persistent across restarts)
- ✅ Cache room availability data for better performance
- ✅ Support rate limiting properly
- ✅ Work correctly with multiple server instances

---

## 💡 Pro Tips

1. **Monitor Redis Usage:**
   - Railway shows Redis memory usage in the service dashboard
   - Free tier usually includes enough for small apps

2. **Backup Strategy:**
   - Redis data is ephemeral (lost on restart)
   - This is fine for verification codes (they expire anyway)
   - Important data should be in PostgreSQL, not Redis

3. **Performance:**
   - Redis significantly improves app performance
   - Caching reduces database queries
   - Verification codes are faster with Redis

---

## 📞 Need Help?

- **Railway Support**: Check Railway documentation or Discord
- **Redis Issues**: Verify your REDIS_URL format matches Railway's output
- **App Still Not Working**: Check that you've redeployed after adding the variable

