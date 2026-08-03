# UK-first rebuild implementation plan

## Baseline

- Keep the existing Astro architecture, React 19, Tailwind CSS 4, npm and Vercel. Astro was upgraded from 6 to 7 during delivery to resolve the audited toolchain advisories; the static-first rendering model remains suitable for crawlable commercial pages and a small calculator island.
- Replace the current French route/copy system rather than layering a `/uk/` section on top of it.
- Move commercial facts, contact details, feature gates, claims and metadata into typed configuration.
- Keep B2C sales, checkout, trials, reviews and unverified claims disabled until owner evidence is supplied.
- Route all commercial enquiries to WhatsApp. Build the application message locally in the browser; do not add an email route, lead endpoint, webhook or CRM.
- Initial baseline: `npm test` passed 4/4 tests; `npm run build` built 14 routes; no lint or type-check script exists; `npm audit` reported 10 advisories (8 high, 2 low).
- The requested keyword exports and `IPTV_Master_Reference.md` are absent. Use the brief's embedded intent clusters and record the missing inputs as launch blockers.

## Delivery phases

1. Establish a high-trust UK B2B design system, route inventory, claims register and configuration contracts.
2. Rebuild shared layout, navigation, footer, metadata, breadcrumbs, analytics, the local WhatsApp application builder and reusable commercial components.
3. Implement the homepage, panel, packages, reseller application, transparent profit calculator, gated individual page, guides, support, contact and legal routes.
4. Add technical SEO, XML sitemap, robots controls, direct redirects, explicit 410 removals and migration test data.
5. Replace the legacy tests with route, metadata, feature-gate, calculator, WhatsApp handoff, link and redirect coverage; update vulnerable dependencies; build and inspect desktop/mobile output.
6. Record exact QA results, launch blockers, deployment commands and the owner actions needed to activate analytics or B2C sales.

## Non-negotiable controls

- No French public copy, anti-blocking guidance, sideloading, protected-service logos, fake proof, invented pricing or unsupported rights/performance/profit claims.
- Every indexable page has one primary intent, one conversion goal, unique metadata and a self-referencing canonical.
- B2C cannot be enabled at build time unless rights, territory, product, device, price, renewal, refund and fulfilment fields validate.
- Analytics events contain behavioural context only—never names, contact details, credentials or free text.
- Static HTML remains the default; client JavaScript is limited to navigation, forms, consent-aware analytics and the calculator.
