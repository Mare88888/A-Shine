# Design system

Dark page, cyan accent, Inter. Tokens live in `tailwind.config.ts` and are what the components use.

## Colour

| Token | Hex | Use |
| ----- | --- | --- |
| `premium-black` | `#08080a` | Page background |
| `premium-charcoal` | `#0f0f12` | Sections |
| `premium-slate` | `#16161a` | Cards, inputs |
| `premium-zinc` | `#1e1e24` | Raised surfaces |
| `premium-graphite` | `#27272d` | Borders, hover |
| `premium-accent` | `#00b8db` | Links, buttons, focus |
| `premium-accent-hover` | `#00a2c4` | Button hover |
| `premium-accent-light` | `#4dd4f0` | Light accent text |
| `text-primary` | `#fafafa` | Headings |
| `text-secondary` | `#a1a1aa` | Body |
| `text-muted` | `#71717a` | Labels |
| `text-disabled` | `#52525b` | Unavailable |
| `error` | `#ff3b3b` | Form errors |
| `warning` | `#ffaa00` | Warnings |

Accent glow: `rgba(0, 184, 219, 0.25)`.

## Type

One sans family (`--font-sans`). Sizes are in `tailwind.config.ts`: `display`, `h1`–`h4`, `body-lg`, `body`, `body-sm`, `caption`, `overline`.

Headings are tight and bold. Overlines are uppercase with wide tracking.

## Shape and space

- Corners: `rounded-sharp` (4px), `rounded-card` (6px).
- Section padding: `py-20 lg:py-28`, horizontal `px-4 sm:px-6 lg:px-8`.
- Content width stays inside the `container-narrow` / page container.

## Buttons

- **Primary:** cyan background, dark text, weight 600.
- **Secondary:** transparent, graphite border, text lightens to cyan on hover.
- **Ghost:** no border, muted text.

Focus uses the accent colour. Press scales to 0.98. Hover scales to 1.02. See [ANIMATIONS.md](./ANIMATIONS.md).
