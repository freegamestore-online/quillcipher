import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { Keyboard } from "./Keyboard";

function renderKeyboard(used: string[] = ["A", "E"], disabled = false) {
  const onKey = vi.fn();
  const onClear = vi.fn();
  render(<Keyboard used={new Set(used)} onKey={onKey} onClear={onClear} disabled={disabled} />);
  return { onKey, onClear };
}

describe("Keyboard", () => {
  it("renders all 26 letters", () => {
    renderKeyboard();
    const letters = screen.getAllByRole("button", { name: /^Letter [A-Z]$/ });
    expect(letters).toHaveLength(26);
    expect(letters.map((b) => b.textContent).sort().join("")).toBe("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  });

  it("marks the used letters and only those", () => {
    renderKeyboard(["A", "E"]);
    const marked = screen.getAllByRole("button", { name: /^Letter [A-Z]$/ }).filter((b) => b.classList.contains("key-used"));
    expect(marked.map((b) => b.textContent).sort()).toEqual(["A", "E"]);
  });

  it("has a Clear button", () => {
    const { onClear } = renderKeyboard();
    fireEvent.click(screen.getByRole("button", { name: "Clear letter" }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("sends the picked letter to onKey", () => {
    const { onKey } = renderKeyboard();
    fireEvent.click(screen.getByRole("button", { name: "Letter Q" }));
    expect(onKey).toHaveBeenCalledWith("Q");
  });

  it("disables every key when disabled", () => {
    renderKeyboard([], true);
    const group = screen.getByRole("group", { name: "Letters" });
    within(group)
      .getAllByRole("button")
      .forEach((b) => expect(b).toBeDisabled());
  });
});
