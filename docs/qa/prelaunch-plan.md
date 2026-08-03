# Pre-launch implementation plan

## Launch blockers

- Keep B2C sales, checkout and trials disabled until their exact configuration contracts are complete and rights evidence is owner-verified.
- Treat the missing master reference and two keyword exports as owner-input blockers; preserve unknown SEO metrics rather than guessing.
- Remove unsafe HSTS preload/subdomain scope pending infrastructure confirmation.
- Ensure every claimed package fact and supplied brand asset has an evidence or ownership status in the claims register.
- Produce a truthful launch decision after production-build and browser validation; live Vercel, DNS, WhatsApp delivery, Search Console and analytics account checks remain owner-operated.

## SEO corrections

- Make route, indexability, metadata, sitemap and feature-gate data derive from central configuration.
- Complete the URL inventory, rendered indexation matrix, keyword map, on-page map, internal-link map and schema matrix with the required columns.
- Strengthen built-output tests for sitemap HTTP/canonical/noindex status, metadata, schema, internal links, orphans and production-host leakage.
- Keep one canonical route per intent and verify direct legacy redirects versus 410 removals.
- Keep Product, Offer, Review, AggregateRating, FAQPage and trial markup disabled unless visible verified content makes it eligible.

## Functional and conversion corrections

- Enforce the full B2C and trial configuration contracts at build time.
- Complete the central analytics event allowlist and verify that only non-PII properties can be emitted.
- Verify the WhatsApp form validates locally, opens the configured destination once and never passes enquiry fields to analytics.
- Preserve UTM and B2C-to-B2B origin only as non-PII attribution.

## Performance and accessibility corrections

- Measure production output and browser behaviour at the required viewports.
- Run accessibility scans on all public pages and inspect keyboard focus, menu behaviour, form errors, touch targets, reduced motion, overflow and text resizing.
- Record lab-only performance evidence, static asset sizes and limitations without representing it as CrUX or field CWV.
- Add no client JavaScript unless it supports a necessary interaction.

## Security corrections

- Tighten launch configuration validation and tests.
- Remove unverified HSTS preload/include-subdomains directives while retaining appropriate baseline security headers.
- Inspect CSP, external links, client configuration, environment files, secret exposure, form data handling, source maps and dependencies.
- Run dependency and repository secret scans available locally; document what they can and cannot prove.

## Analytics corrections

- Document the event contract, consent dependency, preview/development suppression and PII exclusions.
- Test event allowlisting, one-time GA loading and B2C-to-B2B attribution with a mocked browser environment.
- Leave analytics disabled when `PUBLIC_GA4_ID` is empty.

## Migration corrections

- Reconcile every historical route found in Git routes, previous sitemaps, configuration and migration documents.
- Preserve only direct close-intent redirects; retain 410 for unsafe or unmatched URLs.
- Test configured redirects/removals against the production-like route-aware server and document live-edge verification as pending.

## Validation commands

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

Additional SEO/prelaunch scripts will be added to `package.json` and included in `npm run qa` where they do not duplicate existing coverage.

## Rollback implications

- No production deployment is authorised by this audit.
- The owner should deploy through Vercel only after the final decision permits it and required environment variables are reviewed.
- Rollback must promote the last known-good Vercel production deployment; DNS changes are neither required nor authorised.
- If a release introduces 5xx errors, broken lead routing, wrong pricing, index-wide `noindex`, incorrect canonicals, redirect loops, analytics PII or a security incident, roll back immediately and preserve logs for diagnosis.
