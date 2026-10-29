# Refa Creative Portfolio — Blue Gradient Edition

Responsive personal portfolio built with Next.js 14, Tailwind CSS, Framer Motion, and Lucide icons.

## What's changed
- Blue-to-cyan gradient hero with visible radial lighting and a coordinated navy impact/footer theme.
- Repositioned transparent portrait. Desktop portrait overlaps the split-screen panels; mobile portrait moves into its own section so it does not cover the heading.
- Responsive navigation, heading sizes, cards, grids, timeline, contact links, and footer.
- Included `preview.html`, a standalone responsive preview that can be opened directly in a browser without installing dependencies.

## Requirements
- Node.js 18.17+ (Node 20 LTS recommended)
- npm

## Preview without installing
Open `preview.html` in a browser. Resize the browser to check desktop and mobile layouts.

## Run the Next.js project
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Production build
```bash
npm run build
npm start
```

## Before publishing
1. Replace the LinkedIn placeholder URL in `app/page.tsx` with the actual profile URL.
2. Confirm employment dates and performance metrics.
3. Add real project case-study links/screenshots where available.
4. Add a CV download link if needed.

## Main files
- `app/page.tsx` — portfolio components and content.
- `app/globals.css` — global styling and gradient background.
- `app/layout.tsx` — metadata.
- `tailwind.config.ts` — design tokens.
- `public/refa-human.webp` — optimized generated portrait cutout.
- `preview.html` — standalone responsive preview.
