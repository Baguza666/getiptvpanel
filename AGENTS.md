# Permanent project rules

- The public site is UK B2B first. Individual subscription information is secondary.
- Individual subscriptions are feature-gated; trials and checkout remain unpublished until their complete launch contracts validate.
- Use natural British English and GBP. Do not create a `/uk/` duplicate.
- Do not publish evasion, anti-blocking, sideloading, Downloader-code or unofficial APK content.
- Do not claim distribution rights, protected services, channel or VOD counts, uptime, profits, reviews, users, offices or support performance without verified evidence in `docs/claims-register.csv`.
- Do not use protected broadcaster, platform, league, club or event logos without written permission.
- Do not add fake schema, reviews, ratings, prices, offers, company details or contact data.
- Do not create doorway pages. Every indexable page needs one defined search intent, unique metadata and one primary conversion goal.
- All feature gates, package data, contact values, claims and page metadata come from `src/config/`.
- B2C checkout must fail the launch validator unless rights, territory, product, device, GBP price, renewal, refund and fulfilment fields are present.
- Trials remain unpublished unless every field in the trial validator is configured.
- Analytics must not receive names, email addresses, phone numbers, credentials or free-text submissions.
- Primary content remains statically rendered. Add client JavaScript only for a necessary interaction.
- All production changes require type checks, tests, a production build and built-site validation. Update `docs/qa-report.md` with measured results.
- Preserve direct redirects only for close intent equivalents. Use 410 for obsolete, unsafe or unmatched legacy content; never blanket-redirect to the homepage.
- Structured data must match visible page content and must not render on feature-gated or `noindex` pages.
- Do not deploy production without explicit owner approval.

## Framework conventions

- Astro 7 static output is the default rendering model; keep primary copy in server-rendered HTML.
- React 19 is limited to necessary interactive islands such as the profit calculator.
- npm and Node.js 22.12+ are required; Vercel is the configured host.
- Canonical URLs use `https://getiptvpanel.com`, lowercase paths and no trailing slash except the root URL.
- Put site, contact, page metadata, feature gates, claims and package terms in `src/config/`.

## Required checks

```sh
npm ci
npm run check
npm run lint
npm test
npm run build
npm run test:site
npm run test:e2e
npm audit --audit-level=low
npm run qa
```
