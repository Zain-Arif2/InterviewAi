import { Redis } from '@upstash/redis';

/**
 * Create an Upstash Redis client.
 * Uses REST-based client compatible with Vercel Edge and serverless.
 * Falls back gracefully if credentials aren't set (dev mode).
 */
function createRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn('⚠️  Upstash Redis credentials not set. Rate limiting disabled.');
    return null;
  }

  return new Redis({ url, token });
}

const redis = createRedisClient();

export default redis;