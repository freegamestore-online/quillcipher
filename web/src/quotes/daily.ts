import { QUOTES, type Quote } from "./quotes";

/**
 * The daily quote for a UTC date string such as "2026-10-16". The index is the sum of
 * the string's character codes, modulo the catalogue size. Same date, same quote.
 */
export function getDailyQuote(utcDateStr: string): Quote {
  let sum = 0;
  for (let i = 0; i < utcDateStr.length; i++) sum += utcDateStr.charCodeAt(i);
  return QUOTES[sum % QUOTES.length]!;
}

/** A free-play quote picked by seed. Negative or fractional seeds are wrapped into range. */
export function getFreePlayQuote(seed: number): Quote {
  const n = QUOTES.length;
  const index = ((Math.floor(seed) % n) + n) % n;
  return QUOTES[index]!;
}
