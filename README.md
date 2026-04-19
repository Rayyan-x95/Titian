# Titan

Titan is a minimal, offline-first productivity shell built with React, Vite, TypeScript, Tailwind CSS, custom UI primitives, React Router, and Zustand.

Titan is your all-in-one productivity system to manage tasks, notes, and expenses in one place.

## Setup

1. Install dependencies.

```bash
npm install
```

1. Start the development server.

```bash
npm run dev
```

1. Build for production.

```bash
npm run build
```

1. Preview the production build.

```bash
npm run preview
```

## Notes

- Dark mode is the default theme.
- Navigation is mobile-first and bottom anchored.
- Zustand is installed and reserved for future state logic.
- Routing is wired for Dashboard, Tasks, Notes, Finance, and Settings.

## Deployment

### Option A: Vercel

1. Install Vercel CLI.

```bash
npm i -g vercel
```

1. Deploy preview.

```bash
vercel
```

1. Deploy production.

```bash
vercel --prod
```

This repo includes `vercel.json` for SPA rewrites and PWA-friendly cache headers.

### Option B: Netlify

1. Connect repository in Netlify dashboard.
1. Build command: `npm run build`
1. Publish directory: `dist`

This repo includes `netlify.toml` and `public/_redirects` for route handling.

## Launch Kit

The full Phase 9 launch plan is in:

- `docs/launch/launch-checklist.md`
- `docs/launch/app-store-assets.md`
- `docs/launch/channel-copy.md`
- `docs/launch/feedback-loop.md`

## Growth Execution (First Users)

1. Launch on Product Hunt with screenshots and demo video.
1. Publish story-led posts in Reddit communities (`r/productivity`, `r/students`, `r/webdev`).
1. Publish Instagram (Ninety5) carousel and optional short reel.
1. Publish LinkedIn founder journey post.
1. Collect and triage feedback weekly, fix critical issues first, then iterate.
