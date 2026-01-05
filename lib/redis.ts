/**
 * Redis Client Configuration
 * Optimized for 500+ daily active users
 * 
 * IMPORTANT: Redis is completely optional.
 * If REDIS_HOST is not set or is localhost, no Redis client will be created.
 */

import Redis from "ioredis"

const globalForRedis = globalThis as unknown as {
  redis: Redis | null | undefined
}

// Only create Redis client if explicitly configured with a real host
const shouldUseRedis = 
  process.env.REDIS_HOST && 
  process.env.REDIS_HOST !== "localhost" &&
  process.env.REDIS_HOST !== "127.0.0.1" &&
  process.env.REDIS_HOST.trim() !== ""

// Export null if Redis should not be used
export const redis: Redis | null = (() => {
  // Return cached instance if exists
  if (globalForRedis.redis !== undefined) {
    return globalForRedis.redis
  }

  // Don't create Redis if not configured
  if (!shouldUseRedis) {
    globalForRedis.redis = null
    return null
  }

  // Only create Redis client if explicitly configured
  const client = new Redis({
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

  // Only attach error handlers if client was created
  client.on("error", (err) => {
    console.error("Redis Client Error:", err)
    // Don't throw - allow fallback
  })

  client.on("connect", () => {
    console.log("✅ Redis connected")
  })

  // Cache the client
  if (process.env.NODE_ENV !== "production") {
    globalForRedis.redis = client
  }

  return client
})()
