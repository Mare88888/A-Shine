# Motion

Animations use [Framer Motion](https://www.framer.com/motion/). Shared values are in `src/lib/motion.ts`. Sections enter through `SectionEntrance` in `src/components/MotionSection.tsx`.

Motion is short and ease-out. Durations: 0.2s, 0.35s, and 0.5s.

| What | How |
| ---- | --- |
| Sections | Fade in and move up 20px, once, when scrolled into view |
| Card grids | Children stagger by 0.08s, each fading up 16px |
| Cards | Hover lifts 4px |
| Buttons | Hover scale 1.02, press scale 0.98 |

`SectionEntrance` uses `useInView` with `once: true`. Button and card variants are `buttonHover`, `buttonTap`, and `cardHover` from `src/lib/motion.ts`.
