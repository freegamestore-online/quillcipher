const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

interface KeyboardProps {
  /** Plain letters that are already guessed somewhere. They are marked, not hidden. */
  used: ReadonlySet<string>;
  /** Called with the plain letter the player picked. */
  onKey: (letter: string) => void;
  /** Called by the clear key. */
  onClear: () => void;
  /** Turns every key off, for example while no cipher letter is selected. */
  disabled?: boolean;
}

/** On-screen A-Z keyboard. Keys are at least 44px tall for touch. */
export function Keyboard({ used, onKey, onClear, disabled = false }: KeyboardProps) {
  return (
    <div className="keyboard" role="group" aria-label="Letters">
      {ROWS.map((row) => (
        <div key={row} className="keyboard-row">
          {row.split("").map((letter) => (
            <button
              key={letter}
              type="button"
              className={`key${used.has(letter) ? " key-used" : ""}`}
              aria-label={`Letter ${letter}`}
              disabled={disabled}
              onClick={() => onKey(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      ))}
      <div className="keyboard-row">
        <button type="button" className="key key-wide" aria-label="Clear letter" disabled={disabled} onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  );
}
