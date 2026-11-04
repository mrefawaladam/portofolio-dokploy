# Fix Header Navigation Breakpoint for Tablet Viewports

Written against: 4e1bdc02e39479d63128b7d00f85c6c3108a79a4

## Evidence chain

- Surface: `app/page.tsx:161,175` (Header Navigation)
- Problem: The desktop navigation pill expands at `md:flex` (768px), containing 10 links with `gap-5 px-6 py-3.5` (~780px wide). Combined with the logo (140px), Admin button, and header padding, total width exceeds 1000px, crowding and overflowing header space on tablet viewports (768px–1023px).
- Design evidence: Header flex container is bounded by padding `px-5 md:px-10 lg:px-14`. At 768px, horizontal space is insufficient for both logo, 10-item nav pill, and action buttons without collision.
- Owner: `app/page.tsx`
- Scope and affected surfaces: Header navigation bar on screen widths 768px to 1023px.
- Uncertainty: None.

## Design decision

Adjust the breakpoint for desktop navigation pill from `md:flex` to `lg:flex` and hamburger button from `md:hidden` to `lg:hidden`, ensuring mobile menu drawer handles tablet screens cleanly while full horizontal nav pill appears only when sufficient width (>= 1024px) exists.

## Reuse

- Tailwind breakpoints: `lg:flex`, `lg:hidden`
- Exemplar: Standard responsive patterns across subpages (`components/PromptsPageClient.tsx`, `components/NewsPageClient.tsx`)

## Changes

1. `app/page.tsx`
   - Change: Replace `md:flex` with `lg:flex` on `<nav>` (line 161). Replace `md:hidden` with `lg:hidden` on mobile menu button (line 175) and mobile drawer (line 182).
   - Preserve: Navigation items, links, styling, and transitions.
   - Verify: Tablet viewports (768px - 1023px) show clean hamburger toggle without layout squishing; desktop viewports (>= 1024px) show the full pill.

## Scope

- Inherit: `app/page.tsx` header navigation
- Verify: Screen widths 768px, 834px, 1024px, 1280px
- Exclude: Secondary pages (`/tutorials`, `/prompts`, `/news`) which already have smaller headers

## Validation

- Product: Header maintains proper spacing and no horizontal overflow across all device viewports.
- Interface: Test viewport at 768px, 820px, 1024px.
- System: Clean breakpoint transitions.
- Repository: `npm run build` → Build passes.

## Stop conditions

- Stop if nav items are reduced to fewer than 5 items where `md:flex` would fit.

## Design documentation

- None.
