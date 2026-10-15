import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { CryptogramGame } from "./CryptogramGame";
import { freePlayPuzzle } from "./puzzles";
import { lettersIn } from "./logic";
import { loadProgress } from "./progress";

const puzzle = freePlayPuzzle(0);
const letters = lettersIn(puzzle.encoded);
const [first, second] = letters as [string, string];

function tile(cipherLetter: string) {
  return screen.getAllByRole("button", { name: new RegExp(`^Cipher letter ${cipherLetter}, `) });
}

function press(plain: string) {
  fireEvent.click(screen.getByRole("button", { name: `Letter ${plain}` }));
}

describe("CryptogramGame", () => {
  beforeEach(() => localStorage.clear());

  it("fills every tile of the selected cipher letter with one guess", () => {
    render(<CryptogramGame puzzle={puzzle} />);
    const count = tile(first).length;
    fireEvent.click(tile(first)[0]!);
    press(puzzle.solution[first]!);
    expect(screen.getAllByRole("button", { name: `Cipher letter ${first}, guessed ${puzzle.solution[first]}` })).toHaveLength(count);
  });

  it("ignores keyboard presses until a cipher letter is selected", () => {
    render(<CryptogramGame puzzle={puzzle} />);
    press("Q");
    expect(tile(first)[0]!.textContent).toBe(first);
    expect(Object.keys(loadProgress(puzzle.storageKey)?.guesses ?? {})).toHaveLength(0);
  });

  it("marks two cipher letters that share a plain letter as conflicts", () => {
    render(<CryptogramGame puzzle={puzzle} />);
    const plain = puzzle.solution[first] === "Q" ? "R" : "Q";
    fireEvent.click(tile(first)[0]!);
    press(plain);
    fireEvent.click(tile(second)[0]!);
    press(plain);
    expect(tile(first)[0]!.className).toContain("tile-conflict");
    expect(tile(second)[0]!.className).toContain("tile-conflict");
  });

  it("saves guesses under the puzzle's storage key and restores them", () => {
    const { unmount } = render(<CryptogramGame puzzle={puzzle} />);
    fireEvent.click(tile(first)[0]!);
    press(puzzle.solution[first]!);
    unmount();
    expect(loadProgress(puzzle.storageKey)?.guesses[first]).toBe(puzzle.solution[first]);

    render(<CryptogramGame puzzle={puzzle} />);
    expect(tile(first)[0]!.textContent).toContain(puzzle.solution[first]!);
  });

  it("undo reverts the last guess", () => {
    render(<CryptogramGame puzzle={puzzle} />);
    fireEvent.click(tile(first)[0]!);
    press(puzzle.solution[first]!);
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(tile(first)[0]!.getAttribute("aria-label")).toContain("not guessed");
  });
});
