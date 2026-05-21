# /design/

Design-system asset bundle. Reference material for the jay-moore-design portfolio. Not served by Next.js — open the files directly.

## Files

| Path | Purpose |
|---|---|
| [`design-system/README.md`](./design-system/README.md) | Written spec. Tokens, color, typography, components, patterns, motion, a11y, theme, site metadata + OG, voice, process. |
| [`design-system/style-guide.html`](./design-system/style-guide.html) | Visual companion. Single-file HTML, applies the system to itself. Open in a browser. |
| [`jm-logo/`](./jm-logo/) | Source logo assets — favicons, app icons, manifest source files. |
| [`fonts/`](./fonts/) | Self-hosted font reference copies (Hanken Grotesk, Spline Sans Mono). |
| [`specimen-iterations/`](./specimen-iterations/) | Type specimen explorations. |

## Authority

This folder distills from the frozen Phase 0 token contract at [`../process/token-contract.md`](../process/token-contract.md) and the user-provided visual reference image. The Phase 0 HTML mockups in `../process/round-3/` are exploration artifacts, **not** spec.

When a value moves, update [`../process/token-contract.md`](../process/token-contract.md) first, then [`../app/globals.css`](../app/globals.css), then this folder.
