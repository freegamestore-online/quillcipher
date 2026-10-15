import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import { GameButton } from "@freegamestore/games";
import { Celebration } from "../feel/Celebration";
import { HAPTICS } from "../feel/haptics";
import { ScorePop } from "../feel/ScorePop";
import { useHaptics } from "../feel/useHaptics";
import { nextHint } from "./hints";
import { assign, checkGuesses, evaluate, fullSolution, isSolved, type Guesses } from "./logic";
import { Keyboard } from "./Keyboard";
import { loadProgress, saveProgress, type Progress } from "./progress";
import type { Puzzle } from "./puzzles";
import { formatDuration, solveScore } from "./scoring";

/** A short pulse for tapping a cipher letter. */
const TAP_PULSE = 8;
/** Points shown when a guess is right. Shown only, not scored. */
const RIGHT_POINTS = 1;

interface Pop {
  id: number;
  x: number;
  y: number;
}

/** Per-puzzle counters and times. They are saved with the guesses. */
interface Stats {
  startedAt: number | null;
  solvedAt: number | null;
  mistakes: number;
  hints: number;
  hinted: string[];
  revealed: boolean;
}

function statsFrom(saved: Progress | null): Stats {
  return {
    startedAt: saved?.startedAt ?? null,
    solvedAt: saved?.solvedAt ?? null,
    mistakes: saved?.mistakes ?? 0,
    hints: saved?.hints ?? 0,
    hinted: saved?.hinted ?? [],
    revealed: saved?.revealed ?? false,
  };
}

interface CryptogramGameProps {
  puzzle: Puzzle;
}

/**
 * One cryptogram. Tap a cipher letter to select it, then tap a plain letter on the
 * keyboard to fill every place that cipher letter appears. A hint fills one letter
 * for good. The component is keyed by the puzzle's storage key, so each puzzle starts
 * from its own saved progress.
 */
export function CryptogramGame({ puzzle }: CryptogramGameProps) {
  const { quote, encoded, solution, storageKey } = puzzle;
  const haptics = useHaptics();

  const [saved] = useState(() => loadProgress(storageKey));
  const [guesses, setGuesses] = useState<Guesses>(() => saved?.guesses ?? {});
  const [stats, setStats] = useState<Stats>(() => statsFrom(saved));
  const [selected, setSelected] = useState<string | null>(null);
  const [history, setHistory] = useState<Guesses[]>([]);
  const [checks, setChecks] = useState<Record<string, boolean> | null>(null);
  const [pops, setPops] = useState<Pop[]>([]);
  const [celebration, setCelebration] = useState<string | null>(null);
  // Pop-ups are placed where the tile was tapped. The last tap position is kept here.
  const [tapPoint, setTapPoint] = useState({ x: 0, y: 0 });

  const solved = useMemo(() => isSolved(encoded, guesses, solution), [encoded, guesses, solution]);
  const usedPlain = useMemo(() => new Set(Object.values(guesses)), [guesses]);
  const hintedSet = useMemo(() => new Set(stats.hinted), [stats.hinted]);
  const selectedHinted = selected !== null && hintedSet.has(selected);
  const hint = useMemo(() => (solved ? null : nextHint(encoded, guesses, solution)), [encoded, guesses, solution, solved]);
  const counts = useMemo(() => evaluate(encoded, guesses, solution), [encoded, guesses, solution]);

  useEffect(() => {
    saveProgress(storageKey, {
      guesses,
      solved,
      startedAt: stats.startedAt ?? undefined,
      solvedAt: stats.solvedAt ?? undefined,
      mistakes: stats.mistakes,
      hints: stats.hints,
      hinted: stats.hinted,
      revealed: stats.revealed,
    });
  }, [guesses, solved, stats, storageKey]);

  const onCelebrationDone = useCallback(() => setCelebration(null), []);

  const commit = (next: Guesses) => {
    setHistory((h) => [...h, guesses]);
    setGuesses(next);
    setChecks(null);
  };

  /** Called when a move makes the board solved. A revealed board is not timed, so it keeps no solve time. */
  const onSolvedNow = () => {
    setStats((s) => (s.revealed ? s : { ...s, solvedAt: Date.now() }));
    setCelebration(`solve-${storageKey}`);
  };

  const onTile = (cipherLetter: string, event: MouseEvent<HTMLButtonElement>) => {
    const el = event.currentTarget;
    setTapPoint({ x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop });
    setSelected((s) => (s === cipherLetter ? null : cipherLetter));
    setStats((s) => (s.startedAt === null ? { ...s, startedAt: Date.now() } : s));
    haptics.pulse(TAP_PULSE);
  };

  const onKey = (plain: string) => {
    if (!selected || guesses[selected] === plain || selectedHinted) return;
    const next = assign(guesses, selected, plain);
    const wasSolved = solved;
    const right = solution[selected] === plain;
    commit(next);

    // Mistakes are counted only while the board is still being played.
    setStats((s) => ({
      ...s,
      mistakes: right || s.revealed ? s.mistakes : s.mistakes + 1,
    }));
    if (right) {
      setPops((list) => [...list, { id: Date.now() + Math.random(), x: tapPoint.x, y: tapPoint.y }]);
      haptics.pulse(HAPTICS.clear);
    }
    if (!wasSolved && isSolved(encoded, next, solution)) onSolvedNow();
  };

  const onClear = () => {
    if (!selected || guesses[selected] === undefined || selectedHinted) return;
    commit(assign(guesses, selected, ""));
  };

  const onUndo = () => {
    const previous = history[history.length - 1];
    if (!previous) return;
    setHistory((h) => h.slice(0, -1));
    setGuesses(previous);
    setChecks(null);
    // A hinted letter is locked only while its correct guess stands. Undo can remove that guess, so unlock it.
    setStats((s) => ({ ...s, hinted: s.hinted.filter((c) => previous[c] === solution[c]) }));
  };

  const onHint = () => {
    if (!hint) return;
    const next = assign(guesses, hint.cipherLetter, hint.plain);
    const wasSolved = solved;
    commit(next);
    setStats((s) => ({
      ...s,
      startedAt: s.startedAt ?? Date.now(),
      hints: s.hints + 1,
      hinted: [...s.hinted, hint.cipherLetter],
    }));
    haptics.pulse(HAPTICS.clear);
    if (!wasSolved && isSolved(encoded, next, solution)) onSolvedNow();
  };

  const onCheck = () => setChecks(checkGuesses(guesses, solution));

  const onReveal = () => {
    commit(fullSolution(encoded, solution));
    setSelected(null);
    setStats((s) => ({ ...s, revealed: true }));
  };

  const checkCounts = checks
    ? Object.values(checks).reduce(
        (acc, right) => ({ right: acc.right + (right ? 1 : 0), wrong: acc.wrong + (right ? 0 : 1) }),
        { right: 0, wrong: 0 },
      )
    : null;

  // Score only a solve the player made themselves, with a recorded start.
  const score =
    solved && !stats.revealed && stats.startedAt !== null && stats.solvedAt !== null
      ? solveScore({
          solveMs: stats.solvedAt - stats.startedAt,
          mistakes: stats.mistakes,
          hints: stats.hints,
        })
      : null;

  const words = encoded.split(" ");

  const tileClass = (cipherLetter: string) => {
    const classes = ["tile"];
    if (cipherLetter === selected) classes.push("tile-selected");
    if (hintedSet.has(cipherLetter)) classes.push("tile-hint");
    if (counts.conflicts.has(cipherLetter)) classes.push("tile-conflict");
    if (checks && cipherLetter in checks) classes.push(checks[cipherLetter] ? "tile-right" : "tile-wrong");
    return classes.join(" ");
  };

  const statusText = () => {
    if (solved && stats.revealed) return `${quote.author}, ${quote.source}. Revealed, not scored.`;
    if (solved) return `${quote.author}, ${quote.source}`;
    if (selected) return `Cipher letter ${selected} selected. Pick a letter on the keyboard.`;
    return "Tap a cipher letter to select it.";
  };

  return (
    <section className="cryptogram" aria-label="Cryptogram">
      <div className="cryptogram-board">
        <p className="cryptogram-text">
          {words.map((word, wi) => (
            <span key={wi} className="word">
              {[...word].map((ch, ci) => {
                if (!/^[A-Z]$/.test(ch)) return <span key={ci} className="punct">{ch}</span>;
                const guess = guesses[ch];
                return (
                  <button
                    key={ci}
                    type="button"
                    className={tileClass(ch)}
                    aria-label={`Cipher letter ${ch}, ${guess ? `guessed ${guess}` : "not guessed"}${hintedSet.has(ch) ? ", hinted" : ""}`}
                    aria-pressed={selected === ch}
                    onClick={(e) => onTile(ch, e)}
                  >
                    <span className="tile-cipher">{ch}</span>
                    <span className="tile-guess">{guess ?? ""}</span>
                  </button>
                );
              })}
            </span>
          ))}
        </p>
        {pops.map((p) => (
          <ScorePop
            key={p.id}
            points={RIGHT_POINTS}
            x={p.x}
            y={p.y}
            onDone={() => setPops((list) => list.filter((item) => item.id !== p.id))}
          />
        ))}
        {celebration && <Celebration id={celebration} label="Solved!" onDone={onCelebrationDone} />}
      </div>

      <p className="cryptogram-status" role="status">
        {statusText()}
        {checkCounts && !solved && ` ${checkCounts.right} right, ${checkCounts.wrong} wrong.`}
      </p>
      {score !== null && stats.solvedAt !== null && stats.startedAt !== null && (
        <p className="cryptogram-score">
          Solved in {formatDuration(stats.solvedAt - stats.startedAt)} · {score} points
        </p>
      )}
      {!solved && (
        <p className="cryptogram-score">
          Mistakes {stats.mistakes} · Hints {stats.hints} · Letters left {counts.unguessed}
        </p>
      )}

      <div className="cryptogram-actions">
        <GameButton size="sm" variant="ghost" onClick={onUndo} disabled={history.length === 0}>
          Undo
        </GameButton>
        <GameButton size="sm" variant="ghost" onClick={onCheck} disabled={solved}>
          Check
        </GameButton>
        <GameButton size="sm" variant="secondary" onClick={onHint} disabled={!hint}>
          Hint
        </GameButton>
        <GameButton size="sm" variant="ghost" onClick={onReveal} disabled={solved}>
          Reveal
        </GameButton>
      </div>

      <Keyboard
        used={usedPlain}
        onKey={onKey}
        onClear={onClear}
        disabled={!selected || solved || selectedHinted}
      />
    </section>
  );
}
