/**
 * Redis Client Configuration
 * 
 * IMPORTANT: Redis is completely optional.
 * If REDIS_URL or REDIS_HOST is not explicitly set, exports a NO-OP stub.
 * NO Redis client is created, NO connections attempted.
 * 
 * Supports:
 * - REDIS_URL (Railway, Upstash, etc.) - connection string format
 * - REDIS_HOST + REDIS_PORT + REDIS_PASSWORD (manual configuration)
 */

// Check if Redis should be used - must be explicitly configured
const REDIS_URL = process.env.REDIS_URL?.trim()
const REDIS_HOST = process.env.REDIS_HOST?.trim()

// Determine if Redis should be used
// Priority: REDIS_URL > REDIS_HOST (but not localhost)
const shouldUseRedis = 
  (REDIS_URL && REDIS_URL !== "" && !REDIS_URL.includes("localhost") && !REDIS_URL.includes("127.0.0.1")) ||
  (REDIS_HOST && 
   REDIS_HOST !== "" &&
   REDIS_HOST !== "localhost" &&
   REDIS_HOST !== "127.0.0.1")

// Create a NO-OP stub that does nothing (prevents any Redis connection attempts)
class RedisStub {
  async get() { return null }
  async set() { return "OK" }
  async setex() { return "OK" }
  async del() { return 0 }
  async exists() { return 0 }
  async zcount() { return 0 }
  async zrange() { return [] }
  async zadd() { return 0 }
  async expire() { return 0 }
  async keys() { return [] }
  on() { return this } // Event handlers do nothing
  disconnect() { return Promise.resolve() }
}

// Export Redis client OR stub
export const redis: any = shouldUseRedis ? (() => {
  // Only import and create Redis if explicitly configured
  // Using dynamic import to avoid importing ioredis when not needed
  const Redis = require("ioredis") as typeof import("ioredis").default
  
  // Use REDIS_URL if available (Railway, Upstash format), otherwise use host/port/password
  const client = REDIS_URL 
    ? new Redis(REDIS_URL, {
        maxRetriesPerRequest: 0,
        retryStrategy: () => null,
        connectTimeout: 5000,
        lazyConnect: true,
        enableOfflineQueue: false,
        enableReadyCheck: false,
      })
    : new Redis({
        host: REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: 0,
        retryStrategy: () => null,
        connectTimeout: 5000,
        lazyConnect: true,
        enableOfflineQueue: false,
        enableReadyCheck: false,
      })

  client.on("error", (err: any) => {
    // Only log errors, don't crash - the app should work without Redis
    console.error("Redis Client Error:", err.message || err)
  })

  client.on("connect", () => {
    console.log("✅ Redis connected")
  })

  // Don't connect immediately - wait for first use
  // This prevents connection attempts on startup
  return client
})() : new RedisStub()

// Export a flag to check if Redis is actually configured (not a stub)
export const isRedisAvailable = shouldUseRedis
