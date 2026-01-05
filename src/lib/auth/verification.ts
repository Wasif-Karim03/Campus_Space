/**
 * Email Verification Code Service
 * 
 * Generates, stores, and verifies 6-digit verification codes for email-based login.
 */

import { redis } from "@/lib/redis"

const CODE_EXPIRY_SECONDS = 10 * 60 // 10 minutes
const CODE_KEY_PREFIX = "verification:code:"

// In-memory fallback for development when Redis is not available
const memoryStore = new Map<string, { data: any; expires: number }>()

/**
 * Generate a random 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Store verification code in Redis with email and role
 * Falls back to in-memory storage if Redis is unavailable
 */
export async function storeVerificationCode(
  email: string,
  role: string,
  code: string
): Promise<void> {
  const key = `${CODE_KEY_PREFIX}${email}`
  const value = JSON.stringify({ code, role, email, createdAt: Date.now() })
  
  // If Redis not available, use in-memory storage directly (no async needed)
  if (!redis) {
    const expires = Date.now() + CODE_EXPIRY_SECONDS * 1000
    memoryStore.set(key, { data: value, expires })
    
    // Clean up expired entries periodically
    setTimeout(() => {
      memoryStore.delete(key)
    }, CODE_EXPIRY_SECONDS * 1000)
    
    return // Return immediately - no async operation
  }
  
  // Try Redis with timeout (only if Redis is available)
  try {
    await Promise.race([
      redis.setex(key, CODE_EXPIRY_SECONDS, value),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Redis timeout")), 200)
      )
    ])
  } catch (error) {
    // Fallback to in-memory storage if Redis fails
    console.warn("⚠️ Redis unavailable, using in-memory storage for verification codes")
    const expires = Date.now() + CODE_EXPIRY_SECONDS * 1000
    memoryStore.set(key, { data: value, expires })
    
    // Clean up expired entries periodically
    setTimeout(() => {
      memoryStore.delete(key)
    }, CODE_EXPIRY_SECONDS * 1000)
  }
}

/**
 * Verify and retrieve verification code data
 * Returns the role if code is valid, null otherwise
 */
export async function verifyCode(
  email: string,
  code: string
): Promise<{ role: string; email: string } | null> {
  const key = `${CODE_KEY_PREFIX}${email}`
  
  try {
    // Try Redis first with timeout (only if Redis is available)
    let data: string | null = null
    if (redis) {
      try {
        data = await Promise.race([
          redis.get(key),
          new Promise<string | null>((resolve) => 
            setTimeout(() => resolve(null), 500)
          )
        ]) as string | null
      } catch (error) {
        // Fallback to in-memory storage
      }
    }
    
    // If Redis didn't return data, check memory store
    if (!data) {
      const memoryEntry = memoryStore.get(key)
      if (memoryEntry && memoryEntry.expires > Date.now()) {
        data = memoryEntry.data
      } else if (memoryEntry) {
        // Expired, remove it
        memoryStore.delete(key)
      }
    }
    
    if (!data) {
      return null // Code expired or doesn't exist
    }
    
    const parsed = JSON.parse(data)
    
    if (parsed.code !== code) {
      return null // Invalid code
    }
    
    // Code is valid, delete it (one-time use)
    if (redis) {
      try {
        await redis.del(key)
      } catch (error) {
        // Fallback: remove from memory store
        memoryStore.delete(key)
      }
    } else {
      memoryStore.delete(key)
    }
    
    return {
      role: parsed.role,
      email: parsed.email,
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return null
  }
}

/**
 * Check if a code exists for an email (without consuming it)
 */
export async function hasPendingCode(email: string): Promise<boolean> {
  const key = `${CODE_KEY_PREFIX}${email}`
  if (redis) {
    try {
      const exists = await redis.exists(key)
      return exists === 1
    } catch (error) {
      // Fallback to memory store
    }
  }
  // Use memory store
  const memoryEntry = memoryStore.get(key)
  return memoryEntry ? memoryEntry.expires > Date.now() : false
}

