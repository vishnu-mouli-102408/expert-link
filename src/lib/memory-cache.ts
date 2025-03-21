/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from "./logger";

// Type for cache entry with expiration
type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

// Simple in-memory cache implementation
class InMemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  // Set data in cache with TTL in seconds
  set<T>(key: string, data: T, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data, expiresAt });
    logger.info({ key, ttl: ttlSeconds }, "Added item to in-memory cache");
  }

  // Get data from cache
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    // Return null if not in cache
    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      logger.info({ key }, "Cache entry expired and removed");
      return null;
    }

    logger.info({ key }, "Cache hit from in-memory cache");
    return entry.data as T;
  }

  // Delete single entry
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Clear cache entries by pattern
  clearPattern(pattern: string): void {
    const regex = new RegExp(pattern.replace(/\*/g, ".*"));

    let deletedCount = 0;
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    logger.info({ pattern, deletedCount }, "Cleared cache entries by pattern");
  }

  // Clear entire cache
  clear(): void {
    this.cache.clear();
    logger.info("In-memory cache cleared completely");
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }

  // Run garbage collection to clear expired entries
  runGC(): number {
    const now = Date.now();
    let deletedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      logger.info({ deletedCount }, "Garbage collected expired cache entries");
    }

    return deletedCount;
  }
}

// Create and export a singleton instance
export const memoryCache = new InMemoryCache();

// Setup periodic garbage collection (every 5 minutes)
setInterval(
  () => {
    memoryCache.runGC();
  },
  10 * 60 * 1000
);
