import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache duration types
export type CacheDuration = 'short' | 'medium' | 'long';

// Cache duration mapping (in seconds)
const CACHE_DURATIONS: Record<CacheDuration, number> = {
  short: 300,    // 5 minutes
  medium: 3600,  // 1 hour
  long: 86400,   // 24 hours
};

/**
 * Get cached data or execute function and cache the result
 * @param key - Cache key
 * @param fetchFn - Function to execute if cache miss
 * @param duration - Cache duration type
 * @returns Cached or fresh data
 */
export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  duration: CacheDuration = 'medium'
): Promise<T> {
  try {
    // Try to get from cache first
    const cached = await redis.get(key);
    
    if (cached) {
      return cached as T;
    }
    
    // Cache miss - execute function
    const data = await fetchFn();
    
    // Store in cache with expiration
    await redis.setex(key, CACHE_DURATIONS[duration], JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error('Cache error:', error);
    // Fallback to direct execution if cache fails
    return await fetchFn();
  }
}

/**
 * Invalidate cache by key
 * @param key - Cache key to invalidate
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}

/**
 * Invalidate multiple cache keys
 * @param keys - Array of cache keys to invalidate
 */
export async function invalidateMultipleCache(keys: string[]): Promise<void> {
  try {
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Multiple cache invalidation error:', error);
  }
}