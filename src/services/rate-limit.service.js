import { Ratelimit } from '@upstash/ratelimit';
import redis from '@/lib/redis';
import { RATE_LIMITS } from '@/lib/constants';

/**
 * Rate limiter factory using Upstash Redis.
 * Falls back to allowing all requests if Redis is not configured.
 */

const limiters = {};

function createLimiter(category) {
  if (!redis) {
    return null;
  }

  const config = RATE_LIMITS[category] || RATE_LIMITS.GENERAL;

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, `${parseInt(config.window)} s`),
    analytics: true,
    prefix: `ratelimit:${category.toLowerCase()}`,
  });
}

/**
 * Check rate limit for a given identifier and category.
 * @param {string} identifier - Unique identifier (IP, user ID, etc.)
 * @param {string} category - Rate limit category ('AUTH', 'API', 'GENERAL')
 * @returns {{ success: boolean, limit: number, remaining: number, reset: number }}
 */
export async function checkRateLimit(identifier, category = 'GENERAL') {
  if (!redis) {
    // Redis not configured — allow all requests in development
    return { success: true, limit: 999, remaining: 999, reset: 0 };
  }

  if (!limiters[category]) {
    limiters[category] = createLimiter(category);
  }

  const limiter = limiters[category];
  if (!limiter) {
    return { success: true, limit: 999, remaining: 999, reset: 0 };
  }

  try {
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error.message);
    // Fail open — allow request if rate limiting service is down
    return { success: true, limit: 999, remaining: 999, reset: 0 };
  }
}

/**
 * Get client IP from headers (works with Vercel/proxies)
 */
export function getClientIP(headers) {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return headers.get('x-real-ip') || '127.0.0.1';
}