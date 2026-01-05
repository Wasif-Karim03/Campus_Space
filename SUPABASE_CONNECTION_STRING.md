# 🔗 How to Find Your Supabase Connection String

## Step-by-Step Instructions

### Step 1: Go to Project Settings
1. In your Supabase dashboard, you should see your project
2. Click on the **Settings** icon (⚙️ gear icon) in the left sidebar
3. Or click on your project name at the top, then select **Settings**

### Step 2: Navigate to Database Settings
1. In the Settings menu, click on **"Database"** (or look for "Connection string" section)

### Step 3: Find Connection String
1. Scroll down to find the **"Connection string"** section
2. You'll see different connection string formats
3. Click on the **"URI"** tab (not "JDBC" or "Golang")

### Step 4: Copy the Connection String
1. You'll see a connection string that looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
2. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with the actual password you set when creating the project
3. If you forgot your password, you can reset it in the same settings page

### Step 5: Get Your Password (If Needed)
If you need to see or reset your database password:
1. In the Database settings page
2. Look for **"Database password"** section
3. You can either:
   - View the password (if you saved it)
   - Click **"Reset database password"** to create a new one
4. Copy the password and replace `[YOUR-PASSWORD]` in the connection string

### Example:
If your connection string is:
```
postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres
```

And your password is: `MySecurePassword123!`

Then your final connection string should be:
```
postgresql://postgres:MySecurePassword123!@db.abcdefghijklmnop.supabase.co:5432/postgres
```

---

## Quick Visual Guide

```
Supabase Dashboard
    ↓
Settings (⚙️ icon)
    ↓
Database
    ↓
Connection string section
    ↓
URI tab
    ↓
Copy connection string
    ↓
Replace [YOUR-PASSWORD] with actual password
```

---

## ⚠️ Important Notes

1. **Never share your connection string publicly** - it contains your database password
2. **Keep your password secure** - you'll need it for Vercel environment variables
3. **The connection string format is**: `postgresql://postgres:PASSWORD@HOST:5432/postgres`

---

## Next Step

Once you have your connection string (with password replaced), you'll use it as the `DATABASE_URL` environment variable in Vercel!

