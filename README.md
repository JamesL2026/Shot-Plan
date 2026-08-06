# ShotPlan

Mobile-first practice prescription tool for golfers. Local-first React + Vite + TypeScript PWA. No accounts, no backend — sessions save in the browser with `localStorage`.

## Scripts

```bash
npm install
npm run dev      # local development
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Deploy

Configured for Vercel. `vercel.json` rewrites SPA routes (`/check-in`, `/results`, `/sessions`, `/library`, etc.) to `index.html`. Build output directory is `dist`.
