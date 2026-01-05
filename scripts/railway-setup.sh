#!/bin/bash
# Railway Database Setup Script
# This script runs database migrations on Railway

echo "🚀 Starting Railway database setup..."

# Wait a bit for database to be ready
sleep 5

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Push database schema
echo "🗄️  Creating database tables..."
npx prisma db push --accept-data-loss

echo "✅ Database setup complete!"

# Start the Next.js app
echo "🚀 Starting Next.js application..."
exec npm run start

