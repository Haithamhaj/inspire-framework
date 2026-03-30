// In-memory rate limiter (per IP, per route key)
// Suitable for single-instance MVP; use Redis for multi-instance.

interface Entry { count: number; reset: number }

const store = new Map<string, Entry>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store) {
    if (now > v.reset) store.delete(k);
  }
}, 5 * 60 * 1000);

export function rateLimit(
  ip: string,
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const mapKey = `${key}:${ip}`;
  const now = Date.now();
  const entry = store.get(mapKey);

  if (!entry || now > entry.reset) {
    store.set(mapKey, { count: 1, reset: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export function getClientIp(req: { headers: Record<string, string | string[] | undefined>; socket: { remoteAddress?: string } }): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (Array.isArray(forwarded)) return forwarded[0] ?? "unknown";
  if (typeof forwarded === "string") return forwarded.split(",")[0]?.trim() ?? "unknown";
  return req.socket?.remoteAddress ?? "unknown";
}
