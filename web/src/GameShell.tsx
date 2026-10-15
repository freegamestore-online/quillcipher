import type { ReactNode } from "react";
import {
  GameAuth,
  GameButton,
  GameShell as PlatformShell,
  GameThemeToggle,
  GameTopbar,
  type GameTopbarStat,
} from "@freegamestore/games";

export type PlayMode = "daily" | "free";

interface GameShellProps {
  mode: PlayMode;
  onModeChange: (mode: PlayMode) => void;
  /** Topbar stats for the current puzzle, such as the date or the free-play number. */
  stats?: GameTopbarStat[];
  children: ReactNode;
}

/**
 * The game's frame: the platform shell, the topbar with the theme toggle, the
 * Daily / Free Play switch, and the puzzle. Theme follows the platform toggle and the
 * system setting, through the CSS variables in index.css.
 */
export function GameShell({ mode, onModeChange, stats, children }: GameShellProps) {
  const topbar = <GameTopbar title="Quillcipher" stats={stats} actions={<GameThemeToggle />} />;

  return (
    <PlatformShell topbar={topbar}>
      <GameAuth />
      <div className="play-area">
        <div className="mode-switch" role="group" aria-label="Puzzle mode">
          <GameButton size="sm" variant={mode === "daily" ? "primary" : "ghost"} onClick={() => onModeChange("daily")}>
            Daily
          </GameButton>
          <GameButton size="sm" variant={mode === "free" ? "primary" : "ghost"} onClick={() => onModeChange("free")}>
            Free Play
          </GameButton>
        </div>
        {children}
        <a className="store-link" href="https://freegamestore.online" target="_blank" rel="noopener">
          Built for freegamestore.online
        </a>
      </div>
    </PlatformShell>
  );
}
