# Pre-launch security review

## Scope and result

Static Astro output, environment handling, browser scripts, WhatsApp form hand-off, analytics, external links, Vercel headers, dependencies and generated files were reviewed on 3 August 2026.

- `npm audit --audit-level=low`: 0 known npm vulnerabilities across 647 audited packages.
- Secrets: `.env.local` is ignored and not tracked; public configuration is limited to values intended for the browser. No server secrets or payment credentials are used by the application.
- Secret scan: common private-key, live Stripe, AWS, GitHub and Slack token patterns returned no file matches outside ignored dependencies/build output. `gitleaks` and `trufflehog` were not installed, so no claim is made about those tools.
- Input handling: the lead form uses native constraints, bounded fields and select allowlists. Values are written into a readonly in-page textarea for the visitor to copy; they are never injected as HTML or placed in the WhatsApp URL.
- Analytics: only allowlisted events and bounded context properties are sent; form names, telephone values and prepared messages are not passed to analytics.
- Redirects: fixed configuration only; no user-controlled redirect parameter exists.
- Checkout/uploads/cookies/authentication/API routes: not implemented, so payment-secret, upload, session-cookie, SSRF and server-injection paths are not applicable to the current static build.

## Changes made

1. The B2C validator now requires offer name, territory, rights reference, devices, visible price, GBP currency, tax status, billing frequency, renewal, cancellation, refund, fulfilment, support and checkout destination, plus the rights flag.
2. Direct checkout now fails if B2C publication is disabled.
3. Trial validation now uses the exact price, duration, eligibility, features, device, payment, renewal, cancellation, abuse and support contract.
4. `PUBLIC_SITE_URL`, checkout URLs, WhatsApp digits and GA4 identifiers are validated.
5. Analytics cannot load unless `PUBLIC_ANALYTICS_ENVIRONMENT=production`; Vercel preview builds remain disabled.
6. HSTS was reduced to `max-age=31536000`. `includeSubDomains` and `preload` were removed because the repository contains no complete-domain infrastructure evidence.
7. Unverified third-party panel logos were removed from the public build.
8. Applicant names, telephone numbers and application fields were removed from the `wa.me` query string; the external link is now the bare configured destination.

## Header policy

Vercel config sets HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, COOP, a restrictive Permissions Policy and a tested CSP. The CSP permits the site's inline Astro scripts and optional Google Analytics endpoints. A nonce/hash migration would be stronger but is not launch-critical for this static architecture. Live response-header verification remains required.

## Open risks

- The lawful service operator, rights chain and business/controller identity are owner-input P0 blockers, not code vulnerabilities.
- WhatsApp is an external processor and delivery/retention behaviour is outside this repository.
- No server-side rate limiting or CSRF token is needed for the current no-endpoint form. If a lead API is added, both become mandatory review items.
- No generated source maps were present in `dist/`, and the final default build contained no localhost, loopback or mocked GA identifier.
- HSTS coverage, CSP behaviour with the real GA property, TLS and Vercel edge rules must be verified on the deployed hostname.
