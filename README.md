# MADAuto Website

Next.js 14 (App Router, TypeScript, Tailwind CSS) sajt za MADAuto — stanicu
za tehnički pregled vozila i auto servis u Nišu.

## Struktura

```
src/
  app/
    layout.tsx              # osnovni layout (Header + Footer)
    page.tsx                # naslovna stranica
    o-nama/page.tsx
    usluge/
      tehnicki-pregled/page.tsx
      auto-servis/page.tsx
    cenovnik/page.tsx
    kontakt/page.tsx
    not-found.tsx
    globals.css
  components/
    Header.tsx
    Footer.tsx
  lib/                       # pomoćne funkcije (po potrebi)
public/
  images/
```

## Pokretanje lokalno

```bash
npm install
npm run dev
```

Sajt će biti dostupan na `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Deploy na Vercel

1. Push-uj repozitorijum na GitHub/GitLab/Bitbucket.
2. Na [vercel.com](https://vercel.com) importuj projekat — Vercel automatski
   prepoznaje Next.js (framework preset je već postavljen u `vercel.json`).
3. Klikni **Deploy**.
