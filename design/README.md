# /design/

Design-system asset bundle. Reference material for the jay-moore-design portfolio. Not served by Next.js — open the files directly.

## Files

| File | Purpose |
|---|---|
| [`design-system.md`](./design-system.md) | Written spec. Tokens, components, patterns, motion, a11y, theme, voice, process. |
| [`style-guide.html`](./style-guide.html) | Visual companion. Single-file HTML, applies the system to itself. Open in a browser. |

## Authority

This folder distills from the frozen Phase 0 token contract at [`../process/token-contract.md`](../process/token-contract.md) and the user-provided visual reference image. The Phase 0 HTML mockups in `../process/round-3/` are exploration artifacts, **not** spec.

When a value moves, update [`../process/token-contract.md`](../process/token-contract.md) first, then [`../app/globals.css`](../app/globals.css), then this folder.
