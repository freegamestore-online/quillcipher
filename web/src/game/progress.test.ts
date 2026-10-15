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
