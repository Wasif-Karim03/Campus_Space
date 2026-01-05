/**
 * Clear Cache Script
 * Clears all caches to force fresh data
 */

import { cacheService } from "../src/lib/cache.service"
import { CacheKeys } from "../src/lib/cache-keys"

async function clearCache() {
  console.log("🔄 Clearing caches...")
  
  try {
    // Clear buildings cache
    await cacheService.delete(CacheKeys.buildings())
    console.log("✅ Cleared buildings cache")
    
    // Clear all room list caches
    await cacheService.invalidate("rooms:list:*")
    console.log("✅ Cleared room list caches")
    
    console.log("✅ All caches cleared!")
  } catch (error: any) {
    console.error("❌ Error clearing cache:", error.message)
    process.exit(1)
  }
}

clearCache()
  .then(() => {
    console.log("✅ Cache clearing completed")
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Error:", error)
    process.exit(1)
  })

