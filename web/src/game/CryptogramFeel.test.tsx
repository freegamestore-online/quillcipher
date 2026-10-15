import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { CryptogramGame } from "./CryptogramGame";
import { fullSolution, lettersIn } from "./logic";
import { saveProgress } from "./progress";
import { freePlayPuzzle } from "./puzzles";

const puzzle = freePlayPuzzle(0);
const [first] = lettersIn(puzzle.encoded) as [string];

function tiles(cipherLetter: string) {
  return screen.getAllByRole("button", { name: new RegExp(`^Cipher letter ${cipherLetter}, `) });
}

describe("solve card", () => {
  beforeEach(() => localStorage.clear());

  it("replaces the status line with a card naming the author once solved", () => {
    saveProgress(puzzle.storageKey, {
      guesses: fullSolution(puzzle.encoded, puzzle.solution),
      solved: true,
      startedAt: 1000,
      solvedAt: 61000,
      mistakes: 2,
      hints: 1,
    });
    const { container } = render(<CryptogramGame puzzle={puzzle} />);
    const card = container.querySelector(".solve-card");
    expect(card).not.toBeNull();
    expect(card!.textContent).toContain(puzzle.quote.author);
    expect(card!.textContent).toContain(puzzle.quote.source);
    expect(card!.textContent).toContain("Time 1:00");
    expect(card!.textContent).toContain("Mistakes 2 · Hints 1");
    expect(container.querySelector(".cryptogram-status")).toBeNull();
  });
});

describe("letter flip", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    Reflect.deleteProperty(window, "matchMedia");
  });

  it("flips every tile of a letter when it is first filled correctly, then stops after 200 ms", () => {
    render(<CryptogramGame puzzle={puzzle} />);
    fireEvent.click(tiles(first)[0]!);
    fireEvent.click(screen.getByRole("button", { name: `Letter ${puzzle.solution[first]}` }));

    expect(tiles(first).every((t) => t.classList.contains("tile-flip"))).toBe(true);
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(tiles(first).some((t) => t.classList.contains("tile-flip"))).toBe(false);
  });

  it("does not flip a wrong guess", () => {
    render(<CryptogramGame puzzle={puzzle} />);
    fireEvent.click(tiles(first)[0]!);
    const wrong = puzzle.solution[first] === "Z" ? "Y" : "Z";
    fireEvent.click(screen.getByRole("button", { name: `Letter ${wrong}` }));
    expect(tiles(first).some((t) => t.classList.contains("tile-flip"))).toBe(false);
  });

  it("does not flip when the player prefers reduced motion", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockImplementation(() => ({ matches: true })),
    });
    render(<CryptogramGame puzzle={puzzle} />);
    fireEvent.click(tiles(first)[0]!);
    fireEvent.click(screen.getByRole("button", { name: `Letter ${puzzle.solution[first]}` }));
    expect(tiles(first).some((t) => t.classList.contains("tile-flip"))).toBe(false);
  });
});
