import { describe, expect, it } from "vitest";
import { ALPHABET, buildCipher, decode, encode, hashString, invert } from "./cipher";

describe("buildCipher", () => {
  it("is a bijection over A-Z", () => {
    const cipher = buildCipher(42);
    expect(Object.keys(cipher).sort().join("")).toBe(ALPHABET);
    expect(new Set(Object.values(cipher)).size).toBe(26);
    expect([...Object.values(cipher)].sort().join("")).toBe(ALPHABET);
  });

  it("is reproducible from its seed", () => {
    expect(buildCipher(7)).toEqual(buildCipher(7));
    expect(buildCipher(7)).not.toEqual(buildCipher(8));
  });
});

describe("encode and decode", () => {
  it("encodes letters and keeps punctuation and spaces", () => {
    const cipher = buildCipher(1);
    const encoded = encode("Hi, there!", cipher);
    expect(encoded).toMatch(/^[A-Z][A-Z], [A-Z][A-Z][A-Z][A-Z][A-Z]!$/);
  });

  it("decodes back to the plain text with the full solution", () => {
    const cipher = buildCipher(99);
    const text = "To err is human; to forgive, divine.";
    const encoded = encode(text, cipher);
    expect(decode(encoded, invert(cipher)).toUpperCase()).toBe(text.toUpperCase());
  });

  it("shows unguessed cipher letters as underscores", () => {
    expect(decode("AB C", { A: "X" })).toBe("X_ _");
  });

  it("hashes strings to stable 32-bit seeds", () => {
    expect(hashString("daily:2026-10-16")).toBe(hashString("daily:2026-10-16"));
    expect(hashString("daily:2026-10-16")).not.toBe(hashString("daily:2026-10-17"));
  });
});
