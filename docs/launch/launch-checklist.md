# Titan Launch Checklist (Phase 9)

## Pre-Launch Gate

- [ ] `npm install`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run preview` and manually test all routes
- [ ] Validate offline mode (DevTools > Network > Offline)
- [ ] Confirm PWA install prompt and standalone install flow
- [ ] Confirm no runtime console errors
- [ ] Verify metadata and social cards
- [ ] Verify branding uses Titan everywhere

## Core UX Checks

- [ ] Dashboard loads quickly
- [ ] Tasks: create/edit/delete works
- [ ] Notes: create/edit/delete/linking works
- [ ] Finance: create/edit/delete works
- [ ] Navigation works by URL and direct refresh
- [ ] Theme toggle persists across sessions

## SEO + Discoverability

- [ ] `robots.txt` is reachable
- [ ] `sitemap.xml` is reachable
- [ ] OG tags and Twitter cards present in page source
- [ ] Canonical URL is correct for production domain

## Release Day Sequence

- [ ] Deploy to production (Vercel or Netlify)
- [ ] Smoke test production URLs
- [ ] Publish Product Hunt listing
- [ ] Publish Reddit story posts
- [ ] Publish Instagram carousel + optional reel
- [ ] Publish LinkedIn founder post
- [ ] Start collecting feedback in first 24 hours
