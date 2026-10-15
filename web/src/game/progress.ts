import type { Guesses } from "./logic";

/** What is saved for one puzzle between visits. */
export interface Progress {
  guesses: Guesses;
  solved: boolean;
}

const PREFIX = "quillcipher:progress:";

/** Read saved progress. Returns null when there is none, or when the saved value is not usable. */
export function loadProgress(storageKey: string): Progress | null {
  try {
    const raw = localStorage.getItem(PREFIX + storageKey);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isProgress(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Save progress. Storage that is full or blocked is ignored: the game still works without it. */
export function saveProgress(storageKey: string, progress: Progress): void {
  try {
    localStorage.setItem(PREFIX + storageKey, JSON.stringify(progress));
  } catch {
    // Quota exceeded or storage disabled. Nothing to do.
  }
}

function isProgress(value: unknown): value is Progress {
  if (typeof value !== "object" || value === null) return false;
  const { guesses, solved } = value as Record<string, unknown>;
  if (typeof solved !== "boolean" || typeof guesses !== "object" || guesses === null) return false;
  return Object.values(guesses).every((plain) => typeof plain === "string" && /^[A-Z]$/.test(plain));
}
