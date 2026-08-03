# Pre-launch baseline results

Measured on 3 August 2026 in `/Users/hichamzineddine/Desktop/revendeur-iptv` before this audit made repository changes. The working tree already contained a substantial uncommitted rebuild; those pre-existing changes are the baseline and have been preserved.

## Environment and application

- Git identifier: `ad5c99e` on `main`, with pre-existing tracked and untracked changes.
- Framework: Astro 7.1.6, static output.
- UI island: React 19.2.5 for the profit calculator only.
- Package manager: npm with `package-lock.json`.
- Required runtime: Node.js 22.12 or later.
- Hosting configuration: Vercel (`vercel.json` and `.vercel/project.json`).
- Canonical production origin: `https://getiptvpanel.com`.
- Content system: repository-owned Astro pages and TypeScript configuration; no CMS was found.
- Lead delivery: browser-prepared WhatsApp message; no lead API, email, webhook or CRM integration was found.
- Analytics: optional GA4 loader gated by local consent and `PUBLIC_GA4_ID`.
- Checkout: disabled; no payment integration was found.

## Required source inputs

The following required inputs were not found in the repository root, `research/`, `data/`, `docs/`, `assets/` or `public/`:

- `IPTV_Master_Reference.md`
- `export_research_uk_suggestion_keywords_history_similar_eur_2026-08_iptv.csv`
- `export_research_uk_suggestion_keywords_history_related_eur_2026-08_reseller-iptv.csv`

No search volumes, keyword difficulty, CPC or distribution-rights evidence can be inferred from their absence.

## Commands executed

| Command | Result | Measured output |
|---|---|---|
| `npm ci` | Pass | 646 packages installed; 647 audited; 0 vulnerabilities. |
| `npm run check` | Pass | 61 files; 0 errors, warnings or hints. |
| `npm run lint` | Pass | ESLint exited 0 with no reported findings. |
| `npm test` | Pass | 7 files and 13 tests passed. |
| `npm audit --audit-level=low` | Pass | 0 vulnerabilities. |
| `npm run build` | Pass | Static production build; 20 generated routes/assets entries; completed successfully. |
| `npm run test:site` | Pass | Built-site checks passed for 19 indexable routes. |
| `npm run test:e2e` | Pass | Production build plus 14 Chromium tests passed in 9.6 seconds. |

## Existing failures and limitations

No command failed. A green baseline does not establish launch readiness because the suite did not yet enforce every requirement in the release brief.

- The B2C validator did not require every named offer, tax, billing, cancellation, fulfilment and support field.
- The trial validator did not enforce a configured trial price in the required form.
- The Vercel HSTS header enabled `includeSubDomains` and `preload` without repository evidence that the entire domain estate supports them.
- The analytics allowlist omitted several required events and the conversion contract was not fully tested.
- Required URL, link, schema, security, performance, deployment and final-decision documents were absent.
- Existing URL and keyword CSVs did not use all required columns.
- The production-like preview simulates Vercel redirects and 410 responses; it cannot prove live edge behaviour.
- WhatsApp delivery after the browser opens `wa.me` is outside this repository and cannot be verified locally.
- No Search Console, analytics, CrUX/RUM, DNS, TLS, live-host, Vercel account or payment-provider access was supplied.
- No approved consent legal assessment was supplied; implementation behaviour can be tested, but legal sufficiency is unknown from provided code.
- No field Core Web Vitals data was supplied. Lab results must not be reported as field performance.

