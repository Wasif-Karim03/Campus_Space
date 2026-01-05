/**
 * Redis Client Configuration
 * 
 * IMPORTANT: Redis is completely optional.
 * If REDIS_HOST is not explicitly set, exports a NO-OP stub.
 * NO Redis client is created, NO connections attempted.
 */

// Check if Redis should be used - must be explicitly configured
const REDIS_HOST = process.env.REDIS_HOST?.trim()
const shouldUseRedis = 
  REDIS_HOST && 
  REDIS_HOST !== "" &&
  REDIS_HOST !== "localhost" &&
  REDIS_HOST !== "127.0.0.1"

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
  
  const client = new Redis({
    host: REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 0,
    retryStrategy: () => null,
    connectTimeout: 1000,
    lazyConnect: true,
    enableOfflineQueue: false,
    enableReadyCheck: false,
  })

  client.on("error", (err: any) => {
    console.error("Redis Client Error:", err)
  })

  client.on("connect", () => {
    console.log("✅ Redis connected")
  })

  return client
})() : new RedisStub()
