import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import { GameButton } from "@freegamestore/games";
import { Celebration } from "../feel/Celebration";
import { HAPTICS } from "../feel/haptics";
import { ScorePop } from "../feel/ScorePop";
import { useHaptics } from "../feel/useHaptics";
import { assign, checkGuesses, conflicts, fullSolution, isSolved, type Guesses } from "./logic";
import { Keyboard } from "./Keyboard";
import { loadProgress, saveProgress } from "./progress";
import type { Puzzle } from "./puzzles";

/** A short pulse for tapping a cipher letter. */
const TAP_PULSE = 8;
/** Points shown when a guess is right. Shown only, not scored. */
const RIGHT_POINTS = 1;

interface Pop {
  id: number;
  x: number;
  y: number;
}

interface CryptogramGameProps {
  puzzle: Puzzle;
}

/**
 * One cryptogram. Tap a cipher letter to select it, then tap a plain letter on the
 * keyboard to fill every place that cipher letter appears. The component is keyed by
 * the puzzle's storage key, so each puzzle starts from its own saved progress.
 */
export function CryptogramGame({ puzzle }: CryptogramGameProps) {
  const { quote, encoded, solution, storageKey } = puzzle;
  const haptics = useHaptics();

  const [guesses, setGuesses] = useState<Guesses>(() => loadProgress(storageKey)?.guesses ?? {});
  const [selected, setSelected] = useState<string | null>(null);
  const [history, setHistory] = useState<Guesses[]>([]);
  const [checks, setChecks] = useState<Record<string, boolean> | null>(null);
  const [pops, setPops] = useState<Pop[]>([]);
  const [celebration, setCelebration] = useState<string | null>(null);

  const solved = useMemo(() => isSolved(encoded, guesses, solution), [encoded, guesses, solution]);
  const conflicting = useMemo(() => conflicts(guesses), [guesses]);
  const usedPlain = useMemo(() => new Set(Object.values(guesses)), [guesses]);

  useEffect(() => {
    saveProgress(storageKey, { guesses, solved });
  }, [guesses, solved, storageKey]);

  const onCelebrationDone = useCallback(() => setCelebration(null), []);

  // Pop-ups are placed where the tile was tapped. The last tap position is kept here.
  const [tapPoint, setTapPoint] = useState({ x: 0, y: 0 });

  const commit = (next: Guesses) => {
    setHistory((h) => [...h, guesses]);
    setGuesses(next);
    setChecks(null);
  };

  const onTile = (cipherLetter: string, event: MouseEvent<HTMLButtonElement>) => {
    const el = event.currentTarget;
    setTapPoint({ x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop });
    setSelected((s) => (s === cipherLetter ? null : cipherLetter));
    haptics.pulse(TAP_PULSE);
  };

  const onKey = (plain: string) => {
    if (!selected || guesses[selected] === plain) return;
    const next = assign(guesses, selected, plain);
    const wasSolved = solved;
    commit(next);

    if (solution[selected] === plain) {
      setPops((list) => [...list, { id: Date.now() + Math.random(), x: tapPoint.x, y: tapPoint.y }]);
      haptics.pulse(HAPTICS.clear);
    }
    if (!wasSolved && isSolved(encoded, next, solution)) {
      setCelebration(`solve-${storageKey}`);
    }
  };

  const onClear = () => {
    if (!selected || guesses[selected] === undefined) return;
    commit(assign(guesses, selected, ""));
  };

  const onUndo = () => {
    const previous = history[history.length - 1];
    if (!previous) return;
    setHistory((h) => h.slice(0, -1));
    setGuesses(previous);
    setChecks(null);
  };

  const onCheck = () => setChecks(checkGuesses(guesses, solution));

  const onReveal = () => {
    commit(fullSolution(encoded, solution));
    setSelected(null);
  };

  const checkCounts = checks
    ? Object.values(checks).reduce(
        (acc, right) => ({ right: acc.right + (right ? 1 : 0), wrong: acc.wrong + (right ? 0 : 1) }),
        { right: 0, wrong: 0 },
      )
    : null;

  const words = encoded.split(" ");

  const tileClass = (cipherLetter: string) => {
    const classes = ["tile"];
    if (cipherLetter === selected) classes.push("tile-selected");
    if (conflicting.has(cipherLetter)) classes.push("tile-conflict");
    if (checks && cipherLetter in checks) classes.push(checks[cipherLetter] ? "tile-right" : "tile-wrong");
    return classes.join(" ");
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
                    aria-label={`Cipher letter ${ch}, ${guess ? `guessed ${guess}` : "not guessed"}`}
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
        {solved
          ? `${quote.author}, ${quote.source}`
          : selected
            ? `Cipher letter ${selected} selected. Pick a letter on the keyboard.`
            : "Tap a cipher letter to select it."}
        {checkCounts && !solved && ` ${checkCounts.right} right, ${checkCounts.wrong} wrong.`}
      </p>

      <div className="cryptogram-actions">
        <GameButton size="sm" variant="ghost" onClick={onUndo} disabled={history.length === 0}>
          Undo
        </GameButton>
        <GameButton size="sm" variant="ghost" onClick={onCheck} disabled={solved}>
          Check
        </GameButton>
        <GameButton size="sm" variant="ghost" onClick={onReveal} disabled={solved}>
          Reveal
        </GameButton>
      </div>

      <Keyboard used={usedPlain} onKey={onKey} onClear={onClear} disabled={!selected || solved} />
    </section>
  );
}
