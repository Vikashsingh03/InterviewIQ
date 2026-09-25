const buckets = new Map();

const makeLimiter = (maxRequests, windowMs, message) => {
  return (req, res, next) => {
    const ip =
      req.ip ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      "unknown";
    const now = Date.now();

    if (buckets.size > 5000) {
      for (const [key, entry] of buckets) {
        if (entry.resetTime <= now) buckets.delete(key);
      }
    }

    let entry = buckets.get(ip);
    if (!entry || entry.resetTime <= now) {
      entry = { count: 1, resetTime: now + windowMs };
      buckets.set(ip, entry);
      return next();
    }

    entry.count += 1;

    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({ message });
    }

    return next();
  };
};

export const codeRunLimiter = makeLimiter(
  60,
  10 * 60 * 1000,
  "Too many code runs. Slow down for a few minutes and try again.",
);

export const codeSubmitLimiter = makeLimiter(
  30,
  10 * 60 * 1000,
  "Too many submissions. Take a breath and try again shortly.",
);

export const interviewCodeLimiter = makeLimiter(
  60,
  10 * 60 * 1000,
  "Too many code runs. Slow down for a few minutes and try again.",
);
