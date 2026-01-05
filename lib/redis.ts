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
    
    // Connection pool configuration
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000)
      return delay
    },
    
    // Performance settings
    enableOfflineQueue: false,          // Don't queue when disconnected
    lazyConnect: true,                  // Don't connect immediately (important for Vercel builds)
  })

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis
}

// Handle connection errors gracefully
redis.on("error", (err) => {
  console.error("Redis Client Error:", err)
  // Don't throw - allow fallback to database
})

// Handle connection
redis.on("connect", () => {
  console.log("✅ Redis connected")
})

