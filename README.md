# Ascentra Homepage

Single-page homepage built with Next.js (App Router, static export) and TypeScript.
Source design: Claude Design handoff "Ascentra | Website" → `Ascentra Homepage`.

- `app/page.tsx` → `components/home/AscentraHome.tsx` (page markup + animation loop)
- `components/home/frescoes.ts` — animated line studies in the three triptych panels
- `components/home/heroField.ts` — drifting geometric field behind the hero mark
- `app/globals.css` — all styles
- `public/assets/ascentra-mark.png` — hero mark
- `public/_redirects` — retired routes (/operis, /ascentra-lab, /whatsapp) redirect to `/` on Cloudflare Pages

## Local development

- Install: `npm install`
- Dev server: `npm run dev`
- Production build (static export): `npm run build` → `out/`

## Cloudflare Pages

Deployed by `.github/workflows/deploy-pages.yml` on push to `main`.
Build command `npm run build`, output directory `out`.
