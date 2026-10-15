/** The 26 plain and cipher letters, in order. */
export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * A letter substitution as a map from one letter to another. `buildCipher` maps
 * plain letters to cipher letters, and `encode` reads it that way.
 */
export type Substitution = Record<string, string>;

/**
 * A small seeded generator (mulberry32). The same seed always gives the same
 * sequence, so a puzzle's cipher can be rebuilt from its seed alone.
 */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a hash of a string, as an unsigned 32-bit seed. */
export function hashString(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash;
}

/** A random A-Z bijection, reproducible from `seed`. Plain letter in, cipher letter out. */
export function buildCipher(seed: number): Substitution {
  const rand = seededRandom(seed);
  const shuffled = ALPHABET.split("");
  // Fisher-Yates shuffle.
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  const cipher: Substitution = {};
  ALPHABET.split("").forEach((plain, i) => {
    cipher[plain] = shuffled[i]!;
  });
  return cipher;
}

/** The reverse map, from cipher letter back to plain letter. */
export function invert(cipher: Substitution): Substitution {
  const inverse: Substitution = {};
  for (const [plain, encoded] of Object.entries(cipher)) inverse[encoded] = plain;
  return inverse;
}

/** Encode a text with a cipher. Letters are upper-cased. Anything that is not a letter passes through. */
export function encode(text: string, cipher: Substitution): string {
  return [...text]
    .map((ch) => {
      const upper = ch.toUpperCase();
      return /^[A-Z]$/.test(upper) ? (cipher[upper] ?? upper) : ch;
    })
    .join("");
}

/**
 * Apply a player's partial solution to an encoded text. `partial` maps a cipher
 * letter to the plain letter the player has put there. Cipher letters with no guess
 * show as `_`. Anything that is not a letter passes through.
 */
export function decode(encoded: string, partial: Substitution): string {
  return [...encoded]
    .map((ch) => (/^[A-Z]$/.test(ch) ? (partial[ch] ?? "_") : ch))
    .join("");
}
