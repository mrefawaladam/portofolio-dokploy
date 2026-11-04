# Fix Header Admin Button Contrast on Desktop

Written against: 4e1bdc02e39479d63128b7d00f85c6c3108a79a4

## Evidence chain

- Surface: `app/page.tsx:170-174` (Header Navigation)
- Problem: The Admin link in the header renders white text on a translucent white background (`text-white bg-white/10 border-white/30`) over the right-side hero canvas which turns light cream/white (`#fbfdff`) on desktop viewports (`md:`), making the button unreadable.
- Design evidence: The hero section defines a two-tone layout where the right 51% has `bg-[#fbfdff]` on `md:` (`app/page.tsx:145`). Other elements on light surfaces follow the ink/slate color contract (`text-slate-800` on the nav pill, `text-slate-900` on the mobile button).
- Owner: `app/page.tsx`
- Scope and affected surfaces: Header Admin button on viewports >= 768px (`md:`).
- Uncertainty: None.

## Design decision

Apply responsive light-surface styling to the Admin link on `md:` viewports (`md:border-slate-200 md:bg-white/90 md:text-slate-800 md:hover:bg-slate-100 md:hover:text-blue-600`) while preserving translucent white styles on narrow viewports when sitting over the dark blue gradient.

## Reuse

- Tokens: `border-slate-200`, `bg-white/90`, `text-slate-800`, `hover:text-blue-600`
- Exemplar: `app/page.tsx:161` (Desktop nav pill), `app/page.tsx:255` (Download CV button)

## Changes

1. `app/page.tsx`
   - Change: Update `className` of the Admin Link to include `md:border-slate-200 md:bg-white/90 md:text-slate-800 md:hover:bg-slate-100 md:hover:text-blue-600`.
   - Preserve: Mobile/tablet styling below `md:`.
   - Verify: Admin button is clearly readable with dark slate text and light pill background on desktop viewports.

## Scope

- Inherit: `app/page.tsx` header
- Verify: Desktop viewport (>= 768px) and mobile viewport (< 768px)
- Exclude: Admin portal pages (`app/admin/*`)

## Validation

- Product: Admin button in header is visually legible on all screen sizes.
- Interface: Viewport >= 768px and < 768px.
- System: Conforms to header nav pill and button styling conventions.
- Repository: `npm run build` → Build completes with 0 errors.

## Stop conditions

- Stop if header background layout structure changes.

## Design documentation

- None.
