# GetIPTVPanel Design System

**Intent:** UK-first commercial operations website for prospective IPTV resellers. The interface should feel like a transparent operating workspace: precise, grounded and useful for comparing rates—not like a consumer streaming storefront or a generic blue SaaS template.

## Core direction

- Pattern: real-time / operations landing page with a factual profit calculator and supporting product demonstration.
- Hierarchy: commercial fact → operating workflow → qualification → application.
- Density: medium. Show the numbers early; keep explanatory copy concise.
- Shape language: restrained 7–18px radii, thin borders, flat paper surfaces.
- Imagery: code-native operational UI and diagrams plus owner-supplied website and server logos. Preserve logo proportions, give mixed assets a neutral white frame and declare image dimensions. Do not use unverified content logos, channel walls or lifestyle stock imagery.
- Motion: 150–250ms state transitions only. No reveal animation is required.

## Colour tokens

| Role | Value | Use |
|---|---:|---|
| Ink | `#08130f` | Heroes, footer, calculator result, operational surfaces |
| Raised ink | `#10231b` | Pricing and dashboard cards |
| Paper | `#f4f3ec` | Site background |
| Surface | `#fffdf7` | Forms, cards, table background |
| Muted surface | `#e8eee5` | Application and secondary sections |
| Main text | `#111c17` | Body copy on light surfaces |
| Muted text | `#596960` | Supporting copy on light surfaces |
| Border | `#d2dbd0` | Light dividers and card borders |
| Dark border | `#294038` | Dividers on ink surfaces |
| Action | `#c8f36a` | Primary CTA, focus ring, operational status |
| Action hover | `#b8e35a` | Primary CTA hover |
| Warning | `#f1c75b` | Terms and qualification warnings |
| Error | `#b42318` | Validation and failure states |

Do not introduce gradients. A low-opacity square grid may be used on dark hero surfaces as an operational motif.

## Typography

- Display: `Avenir Next`, `Segoe UI Variable Display`, `Segoe UI`, Arial, sans-serif.
- Body: Inter, `Avenir Next`, `Segoe UI Variable Text`, `Segoe UI`, Arial, sans-serif.
- Data and labels: `SFMono-Regular`, Consolas, `Liberation Mono`, monospace.
- Headlines use weight 750, line-height 1.02 and tight negative tracking.
- Eyebrows and data labels are uppercase mono at 11–12px with generous letter spacing.
- Body copy remains 16px minimum with 1.65 line height.

No remote fonts are required; the system stack avoids a render dependency and remains compatible with the current CSP.

## Component rules

### Navigation

- Sticky deep-ink header, 78px high on desktop.
- Active and hovered links use a 2px chartreuse underline.
- Mobile navigation opens as a full viewport sheet below the header.
- Escape closes the sheet and returns focus to the trigger.

### Buttons

- Minimum 48px height; 7px radius; 14px bold label.
- Primary uses chartreuse with ink text.
- Secondary uses a visible outline and inverts on hover.
- Never use scale or translate hover effects that shift layout.

### Commercial metrics

- Place immediately below dark heroes.
- Use mono labels, one-line factual values and dividers rather than floating cards.
- Never present invented customer counts, uptime or revenue.

### Rate cards

- Group catalogue items by unit rate, producing three cards for £12, £18 and £24.
- Show the 10-credit minimum total and exact 20-credit total.
- Use small chips for panel names and a full-width CTA at the bottom.
- Do not place seven near-identical pricing cards in one grid.

### Product demonstration

- Render as a labelled browser/workspace frame.
- Use only owner-confirmed data and clearly mark the view as a demonstration.
- The caption must state that exact controls can vary and no real account or performance data is shown.

The homepage hero uses the live profit calculator instead of the product demonstration. Keep the demonstration on the dedicated reseller-panel route.

### Forms

- Divide the enquiry into labelled fieldsets: contact details and operating plan.
- Labels remain visible; do not use placeholder-only inputs.
- Inputs are 50px minimum height with a 3px accessible focus treatment.
- Status copy is live-region compatible. Validate locally, prepare the message in the browser and open WhatsApp; do not submit application values to the website.

### Tables and editorial pages

- Use tables when term-by-term comparison is materially clearer than cards.
- Allow horizontal table scrolling on narrow screens.
- Editorial pages use a sticky contents rail at desktop and a 48rem reading measure.

## Page composition

1. Hero with one conversion goal and an optional live calculator or operational demonstration.
2. Factual metric strip.
3. Evidence / operating workflow.
4. Published rate groups or decision checklist.
5. Calculator or qualification bridge.
6. Application / final CTA.

Not every page needs every section. Content pages should remain editorial instead of imitating the homepage.

## Accessibility and responsive rules

- WCAG 2.2 AA target; 4.5:1 body-text contrast.
- Every interactive target is at least 44×44px; primary controls are 48px high.
- Maintain visible `:focus-visible` rings on all controls.
- Respect `prefers-reduced-motion` and avoid autoplay.
- Verify at 375px, 768px, 1024px and 1440px.
- No horizontal page scroll at 320px; comparison tables may scroll inside their labelled container.
- Sticky mobile CTA must not cover page content or the consent banner.

## Forbidden patterns

- Generic blue/purple SaaS gradients or glassmorphism.
- Repeating the same three-card layout in every section.
- Emojis as structural icons.
- Channel-logo walls, fake testimonials, fake counters or unsupported performance claims.
- Multiple competing primary CTAs in one section.
- Text baked into raster imagery when semantic HTML can carry it.
- Invisible form labels, low-contrast supporting text or layout-shifting hovers.
