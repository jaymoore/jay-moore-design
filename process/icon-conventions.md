# Icon Conventions — jay-moore-design

Convention doc. Source of truth for icon library, default props, and the curated set v1 ships with. Future sessions inherit this.

## Library

[`lucide-react`](https://lucide.dev/) — installed via Task 1 Step 3 of the implementation plan.

```bash
npm install lucide-react
```

## Defaults

| Prop | Value |
|---|---|
| `strokeWidth` | `1.5` |
| `size` | `16` for inline-with-text, `20` for standalone targets |
| `aria-hidden` | `"true"` when decorative next to text |
| `aria-label` | required when the icon is the only content |

## Principle

The Round 3 locked artifact uses **zero icons**. Letterforms do the work. Icons replace text that wouldn't fit; **they never decorate**. Every icon shipped is a budget line item — site-wide instance count is expected to land around five at v1.

## Icon set — v1

### Nav and footer

| Name | Use |
|---|---|
| `ArrowUpRight` | External links, "view case study" |
| `ArrowRight` | Internal CTAs |
| `Github` | Footer |
| `Linkedin` | Footer |
| `Mail` | Contact |

### Demo surfaces

| Name | Use |
|---|---|
| `GitBranch` | Lifecycle / process |
| `Workflow` | Lifecycle automation |
| `LineChart` | Decision support, metrics |
| `Activity` | Streaming / live |
| `Shield` | Trust surface demo |

### Meta

| Name | Use |
|---|---|
| `Clock` | Timeline strip |
| `Dot` | Status indicator — **prefer a CSS pseudo-element or a `bg-ok` span over the icon** |

## Skip list

Do not use. These will drift positioning:

- `Sparkles`, `Wand2`, `Bot`, `Cpu` — overused AI shorthand, reads "ChatGPT wrapper."
- Brand glyphs from Figma, Notion, Slack, etc. — break the cool-slate palette with brand color.

## Usage

```tsx
import { ArrowUpRight } from "lucide-react";

<ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
```

When the icon is the only content of an interactive target, narrate the action:

```tsx
<button type="button" aria-label="Open menu">
  <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
</button>
```
