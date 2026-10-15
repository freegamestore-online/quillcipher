import { buildCipher, encode, hashString, invert, type Substitution } from "../cipher/cipher";
import { getDailyQuote, getFreePlayQuote } from "../quotes/daily";
import type { Quote } from "../quotes/quotes";

/** One playable cryptogram: the quote, its cipher, and the key its progress is saved under. */
export interface Puzzle {
  quote: Quote;
  /** Seed for the cipher. Together with the quote it fixes the puzzle. */
  seed: number;
  /** Plain letter to cipher letter. */
  cipher: Substitution;
  /** Cipher letter to plain letter. */
  solution: Substitution;
  encoded: string;
  storageKey: string;
}

function build(quote: Quote, seed: number): Puzzle {
  const cipher = buildCipher(seed);
  return {
    quote,
    seed,
    cipher,
    solution: invert(cipher),
    encoded: encode(quote.text, cipher),
    storageKey: `${quote.id}:${seed}`,
  };
}

/** Today's cryptogram. Its quote and cipher come from the UTC date alone. */
export function dailyPuzzle(utcDateStr: string): Puzzle {
  return build(getDailyQuote(utcDateStr), hashString(`daily:${utcDateStr}`));
}

/** A free-play cryptogram for a seed. The same seed always gives the same puzzle. */
export function freePlayPuzzle(seed: number): Puzzle {
  return build(getFreePlayQuote(seed), hashString(`free:${seed}`));
}
