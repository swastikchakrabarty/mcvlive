/**
 * Production Rate Limiter & Abuse Defense Engine
 *
 * Implements a high-precision sliding log window algorithm.
 * Supports multi-dimensional defense: IP-based flood defense and email-based anti-abuse.
 * Automatically cleans up expired state to prevent memory leakage in single-instance and edge environments.
 */

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitRule {
  key: string;
  config: RateLimitConfig;
  reason?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
  retryAfter?: number;
  key?: string;
  reason?: string;
}

class SlidingWindowRateLimiter {
  private store = new Map<string, number[]>();
  private lastPrunedAt = Date.now();
  private readonly PRUNE_INTERVAL_MS = 60 * 1000; // Prune every 1 minute

  /**
   * Evaluates a single key against a sliding window rule.
   */
  public check(key: string, config: RateLimitConfig, reason?: string): RateLimitResult {
    const now = Date.now();
    this.maybePrune(now);

    const windowStart = now - config.windowMs;
    const timestamps = this.store.get(key) || [];

    // Filter out timestamps outside the sliding window
    const validTimestamps = timestamps.filter((t) => t > windowStart);

    if (validTimestamps.length >= config.maxRequests) {
      const oldestInWindow = validTimestamps[0] || windowStart;
      const resetTime = oldestInWindow + config.windowMs;
      const retryAfter = Math.max(1, Math.ceil((resetTime - now) / 1000));

      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        resetInSeconds: retryAfter,
        retryAfter,
        key,
        reason: reason || "Too many requests. Please slow down and try again later.",
      };
    }

    // Record request timestamp
    validTimestamps.push(now);
    this.store.set(key, validTimestamps);

    const remaining = config.maxRequests - validTimestamps.length;
    const oldestTimestamp = validTimestamps[0] || now;
    const resetInSeconds = Math.max(1, Math.ceil((oldestTimestamp + config.windowMs - now) / 1000));

    return {
      success: true,
      limit: config.maxRequests,
      remaining,
      resetInSeconds,
      key,
    };
  }

  /**
   * Evaluates multiple rate limit rules atomically.
   * If any rule fails, returns false without committing timestamps.
   */
  public checkMulti(rules: RateLimitRule[]): RateLimitResult {
    const now = Date.now();
    this.maybePrune(now);

    // 1. Dry-run test all rules
    for (const rule of rules) {
      const windowStart = now - rule.config.windowMs;
      const timestamps = (this.store.get(rule.key) || []).filter((t) => t > windowStart);

      if (timestamps.length >= rule.config.maxRequests) {
        const oldest = timestamps[0] || windowStart;
        const resetTime = oldest + rule.config.windowMs;
        const retryAfter = Math.max(1, Math.ceil((resetTime - now) / 1000));

        return {
          success: false,
          limit: rule.config.maxRequests,
          remaining: 0,
          resetInSeconds: retryAfter,
          retryAfter,
          key: rule.key,
          reason:
            rule.reason || "Rate limit exceeded. Please wait before submitting another request.",
        };
      }
    }

    // 2. All rules passed: commit timestamp to all keys
    let minRemaining = Infinity;
    let maxResetInSeconds = 1;

    for (const rule of rules) {
      const windowStart = now - rule.config.windowMs;
      const timestamps = (this.store.get(rule.key) || []).filter((t) => t > windowStart);
      timestamps.push(now);
      this.store.set(rule.key, timestamps);

      const rem = rule.config.maxRequests - timestamps.length;
      if (rem < minRemaining) minRemaining = rem;

      const oldest = timestamps[0] || now;
      const reset = Math.max(1, Math.ceil((oldest + rule.config.windowMs - now) / 1000));
      if (reset > maxResetInSeconds) maxResetInSeconds = reset;
    }

    return {
      success: true,
      limit: rules[0]?.config.maxRequests || 10,
      remaining: minRemaining === Infinity ? 0 : minRemaining,
      resetInSeconds: maxResetInSeconds,
    };
  }

  /**
   * Resets internal store. Useful for test environments.
   */
  public reset(): void {
    this.store.clear();
    this.lastPrunedAt = Date.now();
  }

  /**
   * Prunes stale keys that have no timestamps in the active window.
   */
  private maybePrune(now: number): void {
    if (now - this.lastPrunedAt < this.PRUNE_INTERVAL_MS) {
      return;
    }

    this.lastPrunedAt = now;
    const maxWindowMs = 60 * 60 * 1000; // 1 hour max retention
    const globalThreshold = now - maxWindowMs;

    for (const [key, timestamps] of this.store.entries()) {
      const valid = timestamps.filter((t) => t > globalThreshold);
      if (valid.length === 0) {
        this.store.delete(key);
      } else {
        this.store.set(key, valid);
      }
    }
  }
}

// Global singleton instance
export const rateLimiter = new SlidingWindowRateLimiter();

/**
 * Extracts the real client IP address from request headers.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp && isValidIp(firstIp)) {
      return firstIp;
    }
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp && isValidIp(realIp)) {
    return realIp;
  }

  const cfConnectingIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cfConnectingIp && isValidIp(cfConnectingIp)) {
    return cfConnectingIp;
  }

  return "127.0.0.1";
}

function isValidIp(ip: string): boolean {
  // Matches basic IPv4 or IPv6 format
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) || /^[0-9a-fA-F:]+$/.test(ip);
}
