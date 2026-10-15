// @vitest-environment node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const css = readFileSync(fileURLToPath(new URL("../index.css", import.meta.url)), "utf8");

describe("keyboard stylesheet", () => {
  it("makes every key at least 44px tall for touch", () => {
    // Touch width is not 44px: ten keys in a row would overflow a 360px phone.
    const rule = css.match(/\.key\s*\{([^}]*)\}/);
    expect(rule).not.toBeNull();
    expect(rule![1]).toMatch(/min-height:\s*44px/);
  });
});
