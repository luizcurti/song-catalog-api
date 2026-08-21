import rateLimit from 'express-rate-limit';

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

export const apiRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
