/**
 * Redis Client Configuration
 * Optimized for 500+ daily active users
 */

import Redis from "ioredis"

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined
}

export const redis =
  globalForRedis.redis ??
  new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    
    // Connection pool configuration - fail fast
    maxRetriesPerRequest: 0,             // Don't retry - fail fast
    retryStrategy: () => null,           // Don't retry - return null to stop retrying
    connectTimeout: 1000,                // Timeout after 1 second
    lazyConnect: true,                   // Don't connect immediately (important for Vercel builds)
    enableOfflineQueue: false,           // Don't queue when disconnected
    enableReadyCheck: false,             // Don't wait for ready state
  })

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis
}

// Handle connection errors gracefully - don't log if Redis is not configured
redis.on("error", (err) => {
  // Only log if Redis is explicitly configured (not default localhost)
  if (process.env.REDIS_HOST && process.env.REDIS_HOST !== "localhost") {
    console.error("Redis Client Error:", err)
  }
  // Don't throw - allow fallback to database
})

// Handle connection
redis.on("connect", () => {
  console.log("✅ Redis connected")
})

// Suppress connection attempts if Redis is not configured
if (!process.env.REDIS_HOST || process.env.REDIS_HOST === "localhost") {
  // Don't attempt to connect - will use in-memory fallback
  redis.disconnect()
}

