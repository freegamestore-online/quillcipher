import { useState } from "react";
import { GameButton } from "@freegamestore/games";
import { GameShell, type PlayMode } from "./GameShell";
import { CryptogramGame } from "./game/CryptogramGame";
import { dailyPuzzle, freePlayPuzzle } from "./game/puzzles";

/** The UTC calendar date, such as "2026-10-16". The daily puzzle is fixed for this. */
function utcDateString(now: Date): string {
  return now.toISOString().slice(0, 10);
}

export default function App() {
  // The daily puzzle is fixed for the UTC day the page was opened on.
  const [today] = useState(() => utcDateString(new Date()));
  const [mode, setMode] = useState<PlayMode>("daily");
  const [freeSeed, setFreeSeed] = useState(0);

  const puzzle = mode === "daily" ? dailyPuzzle(today) : freePlayPuzzle(freeSeed);
  const stats =
    mode === "daily"
      ? [{ label: "Daily", value: today, accent: true }]
      : [{ label: "Free play", value: `#${freeSeed + 1}`, accent: true }];

  return (
    <GameShell mode={mode} onModeChange={setMode} stats={stats}>
      {mode === "free" && (
        <div className="free-actions">
          <GameButton size="sm" variant="secondary" onClick={() => setFreeSeed((n) => n + 1)}>
            Next puzzle
          </GameButton>
        </div>
      )}
      {/* Keyed by storage key, so each puzzle opens with its own saved progress. */}
      <CryptogramGame key={puzzle.storageKey} puzzle={puzzle} />
    </GameShell>
  );
}
