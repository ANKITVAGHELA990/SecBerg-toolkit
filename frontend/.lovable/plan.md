
## TrustData-style Cybersecurity Landing UI

Pure UI clone of the reference mockup — single landing page, no backend, placeholder content I can swap later.

### Layout (single route `/`)

1. **Glass pill navbar** — TrustData logo · Platform / Pricing / Resources / Partners (with chevrons) · "Get a demo →" pill on the right.
2. **Hero over sky/clouds background**
   - Headline: "Reliable performance you can trust in every Situation" (tight, heavy display).
   - Subcopy from mockup.
   - Two CTAs: dark pill "Get a demo →" + light pill "Test your Site".
3. **Floating dashboard preview card** overlapping bottom of hero:
   - Left sidebar: Reporting (Dashboard / Activity / Documents), Findings, All Attacks.
   - Header: "Welcome back, Shafayet 👋" + supporting line · "Testing status: Active" chip · avatar · add button.
   - 4 stat tiles: Open finding 127, New finding 67, Closed findings 235, Avg time to remediate 390 — each with icon, "0% VS 90 days ago", delta badge (green up / orange down).
4. **Minimal footer** — logo + © line.

### Design system

- Sky/cloud gradient hero background (AI-generated image saved to `src/assets/`).
- Off-white app surface, near-black ink, soft shadows, rounded-2xl/3xl, pill buttons.
- Accent green for positive deltas, warm orange for negative.
- Heavy display sans for headline, clean sans for body; loaded via `<link>` in `__root.tsx` head.
- All colors as oklch tokens in `src/styles.css`; no hardcoded color utilities in components.

### Files

- `src/styles.css` — add tokens (sky, ink, surface, accent-up, accent-down, etc.) + font family vars.
- `src/routes/__root.tsx` — add Google Fonts `<link>` tags.
- `src/routes/index.tsx` — replace placeholder, set proper head meta.
- `src/components/landing/Navbar.tsx`, `Hero.tsx`, `DashboardPreview.tsx`, `StatCard.tsx`, `Footer.tsx`.
- `src/assets/sky-hero.jpg` — generated cloud background.

Responsive: dashboard tiles 1/2/4 cols, sidebar collapses on mobile. No auth, no data fetching.
