/**
 * Redis Client Configuration
 * Optimized for 500+ daily active users
 */

import Redis from "ioredis"

const globalForRedis = globalThis as unknown as {
  redis: Redis | null
}

// Only create Redis client if explicitly configured
const shouldUseRedis = process.env.REDIS_HOST && 
                       process.env.REDIS_HOST !== "localhost" &&
                       process.env.REDIS_HOST !== "127.0.0.1"

export const redis: Redis | null =
  globalForRedis.redis ??
  (shouldUseRedis
    ? new Redis({
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD,
        
        // Connection pool configuration - fail fast
        maxRetriesPerRequest: 0,             // Don't retry - fail fast
        retryStrategy: () => null,           // Don't retry - return null to stop retrying
        connectTimeout: 1000,                // Timeout after 1 second
        lazyConnect: true,                   // Don't connect immediately
        enableOfflineQueue: false,           // Don't queue when disconnected
        enableReadyCheck: false,             // Don't wait for ready state
      })
    : null)

if (process.env.NODE_ENV !== "production" && redis) {
  globalForRedis.redis = redis
}

// Handle connection errors gracefully (only if Redis is configured)
if (redis) {
  redis.on("error", (err) => {
    console.error("Redis Client Error:", err)
    // Don't throw - allow fallback
  })

  redis.on("connect", () => {
    console.log("✅ Redis connected")
  })
}

