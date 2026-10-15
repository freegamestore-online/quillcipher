import { describe, expect, it } from "vitest";
import { QUOTES, difficultyFor } from "./quotes";
import { getDailyQuote, getFreePlayQuote } from "./daily";

describe("quote catalogue", () => {
  it("has at least 50 quotes", () => {
    expect(QUOTES.length).toBeGreaterThanOrEqual(50);
  });

  it("gives every quote a unique id", () => {
    const ids = QUOTES.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("records a non-empty author and source for every quote", () => {
    for (const q of QUOTES) {
      expect(q.author.trim(), `${q.id} author`).not.toBe("");
      expect(q.source.trim(), `${q.id} source`).not.toBe("");
    }
  });

  it("is public domain: author died before 1955, or work published before 1929", () => {
    for (const q of QUOTES) {
      const authorPd = q.authorDeathYear !== undefined && q.authorDeathYear < 1955;
      const workPd = q.publicationYear !== undefined && q.publicationYear < 1929;
      expect(authorPd || workPd, `${q.id} has no public-domain basis`).toBe(true);
    }
  });

  it("derives difficulty from text length", () => {
    for (const q of QUOTES) {
      expect(q.difficulty, q.id).toBe(difficultyFor(q.text));
    }
  });

  it("covers all three difficulties", () => {
    const levels = new Set(QUOTES.map((q) => q.difficulty));
    expect(levels).toEqual(new Set(["easy", "medium", "hard"]));
  });
});

describe("daily quote", () => {
  it("is stable for a given UTC date string", () => {
    const first = getDailyQuote("2026-10-16").id;
    for (let i = 0; i < 10; i++) {
      expect(getDailyQuote("2026-10-16").id).toBe(first);
    }
  });

  it("is a catalogue quote", () => {
    const quote = getDailyQuote("2026-01-01");
    expect(QUOTES).toContain(quote);
  });
});

describe("free-play quote", () => {
  it("picks by seed, wrapping past the catalogue size", () => {
    const n = QUOTES.length;
    expect(getFreePlayQuote(3).id).toBe(getFreePlayQuote(3 + n).id);
    expect(getFreePlayQuote(-1).id).toBe(QUOTES[n - 1]!.id);
  });
});
