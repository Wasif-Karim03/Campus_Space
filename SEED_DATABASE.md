# 🌱 How to Seed the Database with OWU Rooms

This guide shows you how to populate your database with all the Ohio Wesleyan University buildings and rooms.

---

## 🎯 What Gets Added

- **100+ rooms** across **15+ buildings**
- **3 sample users** (admin, faculty, student)
- All rooms are set as **active** and ready for booking

---

## 🚀 Option 1: Run Seed on Railway (Recommended)

### Using Railway CLI

1. **Install Railway CLI** (if you haven't already):
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Link to your project**:
   ```bash
   railway link
   ```
   - Select your Railway project when prompted

4. **Run the seed script**:
   ```bash
   railway run npm run db:seed
   ```

5. **Wait for completion** - You'll see output like:
   ```
   ✅ Created room: Elliott 101 (Elliott Hall)
   ✅ Created room: Elliott 102 (Elliott Hall)
   ...
   ✅ Rooms summary: 100+ total across 15+ buildings
   ```

---

## 🚀 Option 2: Run Seed Locally (If Connected to Railway DB)

If you have Railway environment variables set locally:

1. **Get Railway environment variables**:
   ```bash
   railway variables
   ```
   This will create a `.env` file with your Railway variables.

2. **Run the seed script**:
   ```bash
   npm run db:seed
   ```

---

## 🚀 Option 3: Run Seed via Railway Dashboard

1. Go to your **Campus_Space** service in Railway
2. Go to **"Settings"** tab
3. Scroll to **"Deploy Command"** or **"Start Command"**
4. Temporarily change it to:
   ```
   npm run db:seed
   ```
5. Click **"Save"** - Railway will run the seed
6. **IMPORTANT**: After it completes, change it back to:
   ```
   npm start
   ```

---

## ✅ Verify It Worked

After running the seed:

1. Go to your live app: `https://campusspace-production.up.railway.app`
2. Navigate to **Rooms** page
3. You should see all the buildings and rooms listed!

---

## 🔒 Safety Features

The seed script is **safe** to run multiple times:
- ✅ **Won't delete existing data** - Only adds new rooms
- ✅ **Skips duplicates** - Won't create rooms that already exist
- ✅ **Preserves bookings** - Won't delete any existing bookings
- ✅ **Preserves users** - Won't delete existing users

---

## 📊 What Gets Created

### Buildings:
- Elliott Hall
- Slocum Hall
- University Hall
- Merrick Hall
- Schimmel-Conrades Science Center
- Phillips Hall
- Beeghly Library
- Richard M. Ross Art Museum
- Hayes Hall
- Hamilton-Williams Campus Center
- Chappelear Drama Center
- Branch Rickey Arena
- Austin Manor
- Welch Hall
- Edwards Gymnasium
- Stuyvesant Hall
- Sanborn Hall

### Sample Users:
- **Admin**: `admin@owu.edu`
- **Faculty**: `jane.smith@owu.edu`
- **Student**: `john.doe@owu.edu`

---

## 🐛 Troubleshooting

### "Command not found: railway"
- Install Railway CLI: `npm install -g @railway/cli`

### "Database connection error"
- Make sure `DATABASE_URL` is set in Railway
- Check that your PostgreSQL service is running

### "Rooms not showing up"
- Refresh the page
- Check browser console for errors
- Verify seed script completed successfully

### "Seed script fails"
- Check Railway logs for error messages
- Make sure database schema is up to date: `npx prisma db push`

---

## 💡 Pro Tips

1. **Run seed after first deployment** - This populates your database with initial data
2. **Safe to re-run** - The script won't duplicate rooms
3. **Add more rooms later** - Use the admin interface to add additional rooms
4. **Check logs** - Railway shows seed script output in deployment logs

---

## 🎉 You're Done!

Once the seed script completes, all OWU buildings and rooms will be available for booking!

**Next Steps:**
- Test booking a room
- Check the rooms page to see all buildings
- Admins can add more rooms through the admin interface

