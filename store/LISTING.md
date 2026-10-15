# Quillcipher — store listing

**Title:** Quillcipher
**Category:** Puzzle
**Type:** Standalone (no backend; everything is saved in the browser)

**Short description:** Decode a famous public-domain quote one cipher letter at a time. Free, no tracking.

## Description

Quillcipher hides a well-known quote behind a letter-substitution cipher. Every letter has been swapped for another, and your job is to work out which is which. Tap a cipher letter, pick the letter you think it stands for, and it fills in everywhere that letter appears.

- A new daily cryptogram every UTC day, from a catalogue of 86 public-domain quotes
- A free-play mode with a new puzzle on every "Next puzzle" tap
- Conflicts are highlighted in red when two letters claim the same plain letter, and letters already used are marked on the keyboard
- Check shows which guesses are right and which are wrong, Undo takes back your last move, and Clear empties the selected letter
- One Hint fills a letter for good, at a small score cost. Reveal shows the whole solution, but a revealed puzzle is not scored
- Solving reveals the author and source, with your time, score, mistakes and hints
- Your progress is saved in your browser, so you can come back to a half-solved puzzle
- Works on a phone, in light and dark themes, with reduced motion respected
- Free forever, MIT-licensed, with no ads, accounts or tracking

## Credits

Every quote is in the public domain. The authors and sources are listed in `COMPLIANCE.md`. The cipher, the quote catalogue and all the art are original to this game. No images or sounds are downloaded from outside the game. Fonts are Manrope and Fraunces from Google Fonts, under their open licences. Sounds are synthesized in the browser by the platform SDK.

## Screenshots

Captured from the built game at 390 × 844 CSS pixels, 2× device scale (780 × 1688 PNG), in `store/screenshots/`:

- `phone-light.png`: today's daily cryptogram in light mode, partly solved, with the keyboard showing used letters.
- `phone-dark.png`: a free-play cryptogram in dark mode, with a solve card under the board.

## Compliance checklist

- [x] Every quote is public domain: the author died before 1955, or the work was published before 1929. The test `web/src/quotes/quotes.test.ts` checks every entry, and `COMPLIANCE.md` lists them.
- [x] Every quote has a recorded author and source; the source list is complete in `COMPLIANCE.md`.
- [x] Original art and code. No external images, fonts beyond the brand pair, or sounds.
- [x] No external scripts, tracking SDKs or cookies. Analytics only through the platform loader.
- [x] GameShell from `@freegamestore/games`, with the topbar and theme toggle.
- [x] Light and dark themes follow the platform toggle. Reduced motion skips the tile flip.
- [x] Works offline once loaded (the service worker precaches the app).
