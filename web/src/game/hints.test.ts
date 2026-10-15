import { describe, expect, it } from "vitest";
import { buildCipher, encode, invert } from "../cipher/cipher";
import { fullSolution, lettersIn } from "./logic";
import { nextHint } from "./hints";

const cipher = buildCipher(11);
const solution = invert(cipher);
const encoded = encode("the quick brown fox jumps over the lazy dog", cipher);

describe("nextHint", () => {
  it("picks the most frequent unsolved cipher letter", () => {
    const counts = new Map<string, number>();
    for (const ch of encoded.replace(/[^A-Z]/g, "")) counts.set(ch, (counts.get(ch) ?? 0) + 1);
    const top = Math.max(...counts.values());
    const hint = nextHint(encoded, {}, solution);
    expect(hint).not.toBeNull();
    expect(counts.get(hint!.cipherLetter)).toBe(top);
    expect(hint!.plain).toBe(solution[hint!.cipherLetter]);
  });

  it("is deterministic for the same board", () => {
    expect(nextHint(encoded, {}, solution)).toEqual(nextHint(encoded, {}, solution));
  });

  it("skips letters that are already right and may replace a wrong guess", () => {
    const [first] = lettersIn(encoded);
    const hint = nextHint(encoded, { [first!]: solution[first!]! }, solution);
    expect(hint?.cipherLetter).not.toBe(first);

    const wrongGuess = { [first!]: solution[first!] === "Z" ? "A" : "Z" };
    const again = nextHint(encoded, wrongGuess, solution);
    expect(again).not.toBeNull();
  });

  it("returns null once every letter is right", () => {
    expect(nextHint(encoded, fullSolution(encoded, solution), solution)).toBeNull();
  });

  it("only ever hints a letter that appears in the text", () => {
    const hint = nextHint(encoded, {}, solution)!;
    expect(lettersIn(encoded)).toContain(hint.cipherLetter);
  });
});
