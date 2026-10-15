import type { Substitution } from "../cipher/cipher";

/** A player's guesses: cipher letter to the plain letter they have put there. */
export type Guesses = Record<string, string>;

/** The distinct letters of a text, upper-cased, in the order they first appear. */
export function lettersIn(text: string): string[] {
  const seen = new Set<string>();
  for (const ch of text.toUpperCase()) {
    if (/^[A-Z]$/.test(ch)) seen.add(ch);
  }
  return [...seen];
}

/** Set `plain` as the guess for `cipherLetter`. An empty `plain` clears the guess. Returns a new object. */
export function assign(guesses: Guesses, cipherLetter: string, plain: string): Guesses {
  const next = { ...guesses };
  if (plain === "") delete next[cipherLetter];
  else next[cipherLetter] = plain;
  return next;
}

/**
 * Cipher letters whose guess repeats another cipher letter's guess. Two cipher letters
 * cannot share a plain letter, so both are conflicts.
 */
export function conflicts(guesses: Guesses): Set<string> {
  const byPlain = new Map<string, string[]>();
  for (const [cipherLetter, plain] of Object.entries(guesses)) {
    byPlain.set(plain, [...(byPlain.get(plain) ?? []), cipherLetter]);
  }
  const result = new Set<string>();
  for (const group of byPlain.values()) {
    if (group.length > 1) group.forEach((c) => result.add(c));
  }
  return result;
}

/** For each guessed cipher letter, whether the guess matches the solution. */
export function checkGuesses(guesses: Guesses, solution: Substitution): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const [cipherLetter, plain] of Object.entries(guesses)) {
    result[cipherLetter] = solution[cipherLetter] === plain;
  }
  return result;
}

/** Solved when every letter in the encoded text is guessed correctly. */
export function isSolved(encoded: string, guesses: Guesses, solution: Substitution): boolean {
  return lettersIn(encoded).every((c) => guesses[c] !== undefined && guesses[c] === solution[c]);
}

/** The full solution as guesses, for every letter in the encoded text. */
export function fullSolution(encoded: string, solution: Substitution): Guesses {
  const guesses: Guesses = {};
  for (const c of lettersIn(encoded)) guesses[c] = solution[c]!;
  return guesses;
}
