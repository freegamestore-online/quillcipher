import { describe, expect, it } from "vitest";
import { buildCipher, encode, invert } from "../cipher/cipher";
import { assign, checkGuesses, conflicts, fullSolution, isSolved, lettersIn } from "./logic";

const cipher = buildCipher(5);
const solution = invert(cipher);
const encoded = encode("Know thyself", cipher);

describe("guess logic", () => {
  it("lists the distinct letters of a text", () => {
    expect(lettersIn("Know thyself")).toEqual([...new Set("KNOWTHYSELF")]);
  });

  it("assigns and clears a guess without mutating the input", () => {
    const before = { A: "B" };
    const after = assign(before, "C", "D");
    expect(after).toEqual({ A: "B", C: "D" });
    expect(before).toEqual({ A: "B" });
    expect(assign(after, "A", "")).toEqual({ C: "D" });
  });

  it("flags every cipher letter whose plain guess repeats another", () => {
    const flagged = conflicts({ A: "X", B: "X", C: "Y" });
    expect([...flagged].sort()).toEqual(["A", "B"]);
    expect(conflicts({ A: "X", B: "Y" }).size).toBe(0);
  });

  it("checks each guess against the solution", () => {
    const [c1, c2] = lettersIn(encoded);
    const result = checkGuesses({ [c1!]: solution[c1!]!, [c2!]: "Z" }, solution);
    expect(result[c1!]).toBe(true);
    expect(result[c2!]).toBe(solution[c2!] === "Z");
  });

  it("is solved only when every letter in the text is right", () => {
    expect(isSolved(encoded, {}, solution)).toBe(false);
    const full = fullSolution(encoded, solution);
    expect(isSolved(encoded, full, solution)).toBe(true);
    const missing = { ...full };
    delete missing[lettersIn(encoded)[0]!];
    expect(isSolved(encoded, missing, solution)).toBe(false);
  });
});
