# Align Theme Color Tokens in Page Shell

Written against: 4e1bdc02e39479d63128b7d00f85c6c3108a79a4

## Evidence chain

- Surface: `app/page.tsx:141,143,145,235,277`
- Problem: The main landing page uses raw arbitrary hex classes (`bg-[#f4f7fb]`, `text-[#10172a]`, `bg-[#fbfdff]`) instead of defined Tailwind tokens, leading to design system drift.
- Design evidence: `tailwind.config.ts` extends theme colors with `ink: "#10172a"`, `paper: "#f4f7fb"`, and `cream: "#fbfdff"`.
- Owner: `app/page.tsx`
- Scope and affected surfaces: Root `main`, `#top` section background, and `#fbfdff` surface panels in `app/page.tsx`.
- Uncertainty: None.

## Design decision

Replace raw arbitrary hex color classes with canonical Tailwind utility classes:
- `bg-[#f4f7fb]` → `bg-paper`
- `text-[#10172a]` → `text-ink`
- `bg-[#fbfdff]` → `bg-cream`

## Reuse

- Tokens: `bg-paper`, `text-ink`, `bg-cream` from `tailwind.config.ts`
- Exemplar: `tailwind.config.ts:10-14`

## Changes

1. `app/page.tsx`
   - Change: Replace arbitrary hex class occurrences with defined semantic tokens.
   - Preserve: Visual presentation and color exactness.
   - Verify: Styles remain visually identical while referencing design system tokens.

## Scope

- Inherit: `app/page.tsx`
- Verify: Full page rendering
- Exclude: Third-party or external embedded elements

## Validation

- Product: Color tokens resolve correctly via Tailwind compiler.
- Interface: Verify visual identity is identical to design tokens.
- System: Adheres to `tailwind.config.ts` single source of truth.
- Repository: `npm run build` → Zero errors.

## Stop conditions

- None.

## Design documentation

- None.
