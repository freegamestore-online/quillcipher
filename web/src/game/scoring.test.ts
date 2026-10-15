import { describe, expect, it } from "vitest";
import { BASE_SCORE, HINT_PENALTY, MISTAKE_PENALTY, SECONDS_PER_POINT, formatDuration, solveScore } from "./scoring";

describe("solveScore", () => {
  it("gives the full base score for a flawless, instant solve", () => {
    expect(solveScore({ solveMs: 0, mistakes: 0, hints: 0 })).toBe(BASE_SCORE);
  });

  it("takes off a fixed amount per mistake and per hint", () => {
    expect(solveScore({ solveMs: 0, mistakes: 2, hints: 0 })).toBe(BASE_SCORE - 2 * MISTAKE_PENALTY);
    expect(solveScore({ solveMs: 0, mistakes: 0, hints: 3 })).toBe(BASE_SCORE - 3 * HINT_PENALTY);
  });

  it("takes one point off for every full block of seconds", () => {
    const blockMs = SECONDS_PER_POINT * 1000;
    expect(solveScore({ solveMs: blockMs - 1, mistakes: 0, hints: 0 })).toBe(BASE_SCORE);
    expect(solveScore({ solveMs: blockMs, mistakes: 0, hints: 0 })).toBe(BASE_SCORE - 1);
    expect(solveScore({ solveMs: 10 * blockMs, mistakes: 0, hints: 0 })).toBe(BASE_SCORE - 10);
  });

  it("never goes below zero", () => {
    expect(solveScore({ solveMs: 10 ** 9, mistakes: 100, hints: 100 })).toBe(0);
  });

  it("scores fewer mistakes and hints higher, all else equal", () => {
    const clean = solveScore({ solveMs: 60_000, mistakes: 0, hints: 0 });
    expect(solveScore({ solveMs: 60_000, mistakes: 1, hints: 0 })).toBeLessThan(clean);
    expect(solveScore({ solveMs: 60_000, mistakes: 0, hints: 1 })).toBeLessThan(clean);
  });
});

describe("formatDuration", () => {
  it("formats as m:ss", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(125_900)).toBe("2:05");
    expect(formatDuration(-5)).toBe("0:00");
  });
});
