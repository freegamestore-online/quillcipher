import { beforeEach, describe, expect, it } from "vitest";
import { loadProgress, saveProgress } from "./progress";

describe("saved progress", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips guesses and solved state under a storage key", () => {
    saveProgress("quote-a:1", { guesses: { A: "B" }, solved: false });
    expect(loadProgress("quote-a:1")).toEqual({ guesses: { A: "B" }, solved: false });
    expect(loadProgress("quote-a:2")).toBeNull();
  });

  it("ignores saved values that are not usable", () => {
    localStorage.setItem("quillcipher:progress:bad", "{not json");
    expect(loadProgress("bad")).toBeNull();
    localStorage.setItem("quillcipher:progress:bad", JSON.stringify({ guesses: { A: "1" }, solved: false }));
    expect(loadProgress("bad")).toBeNull();
  });
});

describe("saved stats", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips the scoring fields", () => {
    const progress = {
      guesses: { A: "B" },
      solved: true,
      startedAt: 1000,
      solvedAt: 61000,
      mistakes: 2,
      hints: 1,
      hinted: ["C"],
      revealed: false,
    };
    saveProgress("stats", progress);
    expect(loadProgress("stats")).toEqual(progress);
  });

  it("rejects negative or fractional counts", () => {
    localStorage.setItem("quillcipher:progress:neg", JSON.stringify({ guesses: {}, solved: false, mistakes: -1 }));
    expect(loadProgress("neg")).toBeNull();
    localStorage.setItem("quillcipher:progress:frac", JSON.stringify({ guesses: {}, solved: false, hints: 1.5 }));
    expect(loadProgress("frac")).toBeNull();
  });

  it("rejects a hinted list that is not cipher letters", () => {
    localStorage.setItem("quillcipher:progress:hint", JSON.stringify({ guesses: {}, solved: false, hinted: ["a"] }));
    expect(loadProgress("hint")).toBeNull();
  });
});
