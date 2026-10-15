import type { Substitution } from "../cipher/cipher";
import { lettersIn, type Guesses } from "./logic";

/** One letter the game reveals: the cipher letter and the plain letter it stands for. */
export interface Hint {
  cipherLetter: string;
  plain: string;
}

/**
 * The next letter to reveal. It is the cipher letter that appears most often in the
 * text among those not yet right, so one hint unlocks the most tiles. Ties go to the
 * alphabetically earlier letter, so the same board always gives the same hint.
 * Returns null when every letter is already right.
 */
export function nextHint(encoded: string, guesses: Guesses, solution: Substitution): Hint | null {
  const counts = new Map<string, number>();
  for (const ch of encoded.toUpperCase()) {
    if (/^[A-Z]$/.test(ch)) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  }

  let best: string | null = null;
  for (const cipherLetter of lettersIn(encoded)) {
    if (guesses[cipherLetter] === solution[cipherLetter]) continue;
    const n = counts.get(cipherLetter) ?? 0;
    const bestN = best === null ? -1 : counts.get(best) ?? 0;
    if (best === null || n > bestN || (n === bestN && cipherLetter < best)) best = cipherLetter;
  }

  return best === null ? null : { cipherLetter: best, plain: solution[best]! };
}
