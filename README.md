# AMET CEII — The Maritime Innovation Harbour

A ground-up redesign of the **AMET Centre for Entrepreneurship, Innovation & Incubation** (aceii.in) — reimagined as a world-class, maritime-themed incubation site for AMET University's blue-economy ventures.

> **Design concept — "The Harbour":** oceanographic-institute × top-tier venture studio. Abyssal navy, bioluminescent teal, brass instrument accents, and a bathymetric contour-map texture. Editorial serif (Newsreader) × grotesk (Hanken Grotesk) × mono (IBM Plex Mono). Static-first — fully composed under reduced-motion; motion is enrichment only.

## Stack
- **Multi-page static site** (vanilla HTML/CSS/JS, no build) + **one Vercel serverless function** for the Apply / Contact intake.
- Shared design system: `assets/site.css` · shared runtime (nav/footer injection, reveals, count-ups): `assets/site.js`.

## Pages
`index` (Home) · `about` · `programs` · `portfolio` · `events` · `team` · `resources` · `blog` (Journal) · `apply` · `contact`

## Application / contact email
`api/apply.js` emails **aceii@ametuniv.ac.in** via [Resend](https://resend.com) when configured. Set in Vercel:

| Env var | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key (required for real delivery) |
| `CEII_TO` | Recipient (defaults to `aceii@ametuniv.ac.in`) |
| `CEII_FROM` | Verified sender (defaults to Resend sandbox `onboarding@resend.dev`) |

Without `RESEND_API_KEY` the endpoint returns **503** and the forms gracefully tell the user to email CEII directly — it never pretends to have delivered.

## Content honesty
Real facts (name, vision, mission, the three team members, contact details) are accurate. All **portfolio ventures, stats, events, mentors and journal posts are clearly-labelled sample/placeholder content** (`.sample-flag` / `.sample-banner`) to be replaced with real CEII data — per the project's no-fabrication rule.

## Local dev
```bash
npm run dev      # static preview (npx serve)
npm run check    # syntax-check the JS
```
The Apply/Contact function only runs under `vercel dev` or on Vercel.

## Deploy
```bash
vercel --prod
```

— Project 35 of Syed's build index.
