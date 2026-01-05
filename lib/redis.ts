/**
 * Redis Client Configuration
 * 
 * IMPORTANT: Redis is completely optional.
 * If REDIS_HOST is not explicitly set to a non-localhost value, 
 * this module exports null and NO Redis client is ever created.
 */

import Redis from "ioredis"

// Check if Redis should be used - must be explicitly configured
const REDIS_HOST = process.env.REDIS_HOST?.trim()
const shouldUseRedis = 
  REDIS_HOST && 
  REDIS_HOST !== "" &&
  REDIS_HOST !== "localhost" &&
  REDIS_HOST !== "127.0.0.1"

// Export null if Redis should not be used - NO client creation at all
export const redis: Redis | null = shouldUseRedis ? (() => {
  // Only create client if explicitly configured
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

  client.on("error", (err) => {
    console.error("Redis Client Error:", err)
  })

  client.on("connect", () => {
    console.log("✅ Redis connected")
  })

  return client
})() : null
