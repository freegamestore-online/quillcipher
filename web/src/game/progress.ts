import type { Guesses } from "./logic";

/** What is saved for one puzzle between visits. */
export interface Progress {
  guesses: Guesses;
  solved: boolean;
  /** Epoch ms of the first move. Absent until the player moves. */
  startedAt?: number;
  /** Epoch ms of the solve. Absent until solved. */
  solvedAt?: number;
  /** Wrong letters placed. Never goes down, so undoing a mistake does not refund it. */
  mistakes?: number;
  /** Hints used. */
  hints?: number;
  /** Cipher letters a hint has filled. They are locked against further edits. */
  hinted?: string[];
  /** Set when the solution was revealed. A revealed puzzle is not scored. */
  revealed?: boolean;
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
  const v = value as Record<string, unknown>;
  if (typeof v.solved !== "boolean" || typeof v.guesses !== "object" || v.guesses === null) return false;
  if (!Object.values(v.guesses).every((plain) => typeof plain === "string" && /^[A-Z]$/.test(plain))) return false;
  if (v.startedAt !== undefined && !isCount(v.startedAt)) return false;
  if (v.solvedAt !== undefined && !isCount(v.solvedAt)) return false;
  if (v.mistakes !== undefined && !isCount(v.mistakes)) return false;
  if (v.hints !== undefined && !isCount(v.hints)) return false;
  if (v.revealed !== undefined && typeof v.revealed !== "boolean") return false;
  if (v.hinted !== undefined) {
    if (!Array.isArray(v.hinted) || !v.hinted.every((c) => typeof c === "string" && /^[A-Z]$/.test(c))) return false;
  }
  return true;
}

/** A non-negative whole number, as stored for counts and times. */
function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
