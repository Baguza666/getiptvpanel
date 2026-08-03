# Production launch checklist

## Business and compliance

- [ ] Verify legal entity, address, registration, VAT and privacy-controller details.
- [x] Confirm operational ownership of WhatsApp number `+212 782 389 820`.
- [ ] Decide whether a UK-facing phone or WhatsApp number is required.
- [ ] Approve the claims register; keep every unverified claim on hold.
- [x] Supply reseller names, GBP base rates, 10-credit minimum, credit duration and the 20-credit calculation in the typed configuration.
- [x] Confirm that lower unit rates above 20 credits are supplied only after contact.
- [x] Record the owner response that the displayed price has no tax, setup fee or separate panel fee.
- [ ] Verify the service operator, distribution rights and reseller permissions by territory.
- [ ] Obtain legal review of privacy, terms, refunds, acceptable use and commercial agreements.
- [ ] Keep B2C, checkout and trial flags disabled until their validators pass with owner evidence.

## Delivery and analytics

- [ ] Verify every production conversion opens the configured WhatsApp number with the intended context.
- [ ] Review WhatsApp data-processing, retention and privacy terms.
- [ ] Configure `PUBLIC_GA4_ID` only after consent and privacy review.
- [ ] Verify local application validation, message preparation and WhatsApp handoff in the production domain.

## Technical release

- [ ] Run `npm ci` on Node.js 22.12 or newer.
- [ ] Run `npm run qa` and record the exact result in `docs/qa-report.md`.
- [ ] Test desktop and mobile navigation at 375, 768, 1024 and 1440px.
- [ ] Validate homepage, packages, form, calculator, individual route, guides, 404, redirects and 410 responses in the Vercel preview.
- [ ] Re-run `npm audit --audit-level=moderate`.
- [ ] Verify canonical hostname, HTTPS, security headers, sitemap and robots in production.
- [ ] Submit the new sitemap in the verified search-console property.
- [ ] Monitor 404/410 responses and WhatsApp CTA events after deployment.
