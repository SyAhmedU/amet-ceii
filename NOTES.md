# amet-ceii — NOTES

Project 35. A ground-up redesign of **aceii.in** (AMET Centre for Entrepreneurship, Innovation & Incubation) as a world-class, maritime-themed incubation site. Standalone, NOT a research-suite surface.

## Design concept — "The Harbour"
Oceanographic-institute × top-tier venture studio. Deliberately **not** the Syed-fire suite look.
- **Palette** (`assets/site.css` `:root`): depth ramp `--abyss → --deep → --sea → --hull → --shoal`; foam text `--foam/--mist/--haze`; accents `--biolum` (teal, primary), `--signal` (blue), `--brass` (warm), `--coral` (rare).
- **Type:** display `Newsreader` (editorial serif, uses italic for accents via `.display-accent`) · UI `Hanken Grotesk` · mono `IBM Plex Mono` (eyebrows/coordinates/labels). Loaded via Google Fonts `<link>` in every page `<head>`.
- **Atmosphere** (fixed, `z-index:-1`): gradient floor + `assets/contours.svg` (bathymetric chart texture) + grain overlay (`.grain`). Every page starts with `<div class="atmosphere"></div><div class="grain"></div>`.
- **Static-first:** the composition is fully legible with zero motion (CM's machine runs `prefers-reduced-motion`). All motion is gated behind `@media (prefers-reduced-motion: no-preference)`; count-ups restore the **verbatim** final text.

## Architecture (no build)
- `assets/site.css` — the whole design system (tokens, layout, components, forms, reveals).
- `assets/site.js` — injects **header + mobile drawer + footer** on every page from the `NAV` array; wires scrolled-header, mobile menu, `[data-reveal]`/`[data-reveal-stagger]` IntersectionObserver reveals, and `[data-count]` count-ups. **Edit nav/footer here once — do not hand-edit per page.** All injected HTML is static (no user input → no XSS surface).
- 10 pages: `index` · `about` · `programs` · `portfolio` · `events` · `team` · `resources` · `blog` (Journal) · `apply` · `contact`. Each is standalone HTML with the shared `<head>` block + `<script src="assets/site.js" defer>`.
- Page-specific JS is inline (portfolio filter, apply stepper, contact form) — kept local to the page.

## Apply / Contact function — `api/apply.js`
- Vercel Node serverless fn. `POST /api/apply { kind: "application"|"contact", ...fields }`.
- Emails **aceii@ametuniv.ac.in** via **Resend** (`fetch`, no dep). Guard: method + 12 KB size cap + honeypot (`website_hp`) + best-effort in-memory per-IP rate limit (fail-open).
- **Env (Vercel):** `RESEND_API_KEY` (required for delivery), `CEII_TO` (default aceii@ametuniv.ac.in), `CEII_FROM` (default Resend sandbox `onboarding@resend.dev` — change to a verified domain sender for real sends; sandbox only delivers to the Resend account owner).
- **Without `RESEND_API_KEY` → returns 503**; both forms then show a graceful "email us directly" mailto fallback. It never fakes delivery. (Same pattern as rethink-with-ai / career-compass.)

## No-fabrication (hard rule)
Real & accurate: name, vision, mission, the 3 team members (G. Nirmal Raj — CEO; Dr. Anitha Rexalin Devaraj — Director/IIC; V. Velavan — Incubation Associate), email/phones/address, IIC + AMET University affiliation. **Everything else is labelled sample** via `.sample-flag` (inline) / `.sample-banner` (section) — hero metrics, all portfolio ventures, events, mentor roster, journal posts, program durations. Swap in real CEII data before treating any of it as fact.

## Deploy
- Static + `api/` on **Vercel** (chosen over GitHub Pages because Pages can't run the Apply fn). `vercel.json`: cleanUrls, asset caching.
- `vercel --prod` from the folder → **amet-ceii.vercel.app**. Repo **SyAhmedU/amet-ceii**.
- Local: `npm run dev` (static preview) · `npm run check` (syntax-check JS). Apply fn needs `vercel dev` / prod.

## TODO / handoff to CM
- Set `RESEND_API_KEY` (+ verified `CEII_FROM` domain) in Vercel to activate Apply/Contact email.
- Replace all `.sample-*` content with real ventures / stats / events / mentors / posts.
- Consider connecting a real domain (e.g. aceii.in) once AMET signs off.
