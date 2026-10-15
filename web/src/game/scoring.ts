/** Points before any deduction. */
export const BASE_SCORE = 1000;
/** Points taken off for each wrong letter placed. */
export const MISTAKE_PENALTY = 25;
/** Points taken off for each hint used. */
export const HINT_PENALTY = 100;
/** One point is taken off for every this many seconds of solving. */
export const SECONDS_PER_POINT = 5;

/** What a solve is scored on. */
export interface SolveRecord {
  /** Milliseconds from the first move to the solve. */
  solveMs: number;
  mistakes: number;
  hints: number;
}

/** The score for a solve. Never below zero. */
export function solveScore({ solveMs, mistakes, hints }: SolveRecord): number {
  const seconds = Math.max(0, Math.floor(solveMs / 1000));
  const score =
    BASE_SCORE -
    mistakes * MISTAKE_PENALTY -
    hints * HINT_PENALTY -
    Math.floor(seconds / SECONDS_PER_POINT);
  return Math.max(0, score);
}

/** A duration as m:ss, for example 2:05. */
export function formatDuration(ms: number): string {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
