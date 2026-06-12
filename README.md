# Senate Oversight Contact Directory

A single-page directory of U.S. Senate committee rosters for the **119th Congress (2025–2026)**, with each senator's party, DC office phone (click-to-call), and mailing address plus copy-to-clipboard buttons. Built with React + Vite and installable as a **Progressive Web App** (add to home screen, works offline).

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (hot reload) at the printed localhost URL
```

## Build & preview the production app

```bash
npm run build    # output an optimized bundle to dist/
npm run preview  # serve the built bundle locally to test the PWA
```

## Install as an app (PWA)

After `npm run preview` (or once deployed), open the site in a supported browser:

- **Desktop (Chrome/Edge):** click the install icon in the address bar.
- **iOS Safari:** Share → *Add to Home Screen*.
- **Android Chrome:** menu → *Install app* / *Add to Home Screen*.

The service worker precaches the app shell, so it launches full-screen and works without a connection after the first load.

## Icons

PWA icons are generated from [`public/icon.svg`](public/icon.svg):

```bash
npm run gen-icons   # regenerates public/pwa-192x192.png and pwa-512x512.png
```

Replace `public/icon.svg` with real branding and rerun the command to swap them.

## Data

Membership and contact details sourced from **senate.gov (June 2026)**. Committee assignments are subject to change. Reflects the March 2026 Oklahoma seat change (Mullin → Armstrong). US Capitol switchboard: 202-224-3121.
