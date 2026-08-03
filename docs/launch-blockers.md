# Launch blockers and owner inputs

## Resolved inputs

1. **Keyword and master-reference research inputs uploaded.**
   - Status: RESOLVED (3 August 2026).
   - Details: `IPTV_Master_Reference.md` and both UK keyword research exports (`export_research_uk_suggestion_keywords_history_related_eur_2026-08_reseller-iptv.csv` and `export_research_uk_suggestion_keywords_history_similar_eur_2026-08_iptv.csv`) have been integrated into `docs/seo/keyword-map.csv`. Exact search volumes, keyword difficulty scores, CPC, and SERP feature classifications are recorded.

2. **Business Identity Placeholders configured.**
   - Status: RESOLVED (3 August 2026).
   - Details: Per owner directive ("for Owner Business Identity it's not needed or put a placeholder"), clean placeholders (`GetIPTVPanel Operations`, `support@getiptvpanel.com`, UK operations placeholder address) have been added to `src/config/site.ts`.

---

## Remaining owner requirements prior to production deployment

### P0 — Deployment Blockers

1. **The lawful B2B supply and rights chain is not evidenced.**
   - Evidence: package names and prices are owner-confirmed, but the content/package scope, territory, service operator and authority permitting distribution or resale are absent. The site correctly states panel access does not grant third-party content rights, but code cannot establish that the offered supply is lawful.
   - Affected routes: `/`, `/reseller-panel`, `/reseller-packages`, `/become-a-reseller`.
   - Required owner input: written service scope, territory and rights/distribution evidence reviewed for the intended B2B offer.
   - Resolution test: claims-register evidence review, forbidden-copy scan and `npm run qa`.

### P1 — Required before enabling affected features or accepting risk

2. **The UK legality article lacks qualified independent legal review.**
   - Evidence: current GOV.UK/IPO sources were checked on 3 August 2026, but no legal reviewer or sign-off is recorded.
   - Affected route: `/is-iptv-legal-in-the-uk`.
   - Current safeguard: `noindex`, excluded from sitemap, no Article schema.
   - Required owner input: named qualified reviewer, review date and approved wording.
   - Resolution test: update the claims register, remove the gate intentionally, then run metadata, schema, sitemap and browser tests.

3. **Individual sales, direct checkout and trials remain disabled.**
   - Evidence: the B2C and trial objects are empty; no checkout integration exists. Exact field contracts fail the build when unsafe flags are enabled.
   - Affected routes/features: `/individual-subscription`, `/iptv-trial`, checkout and Product/Offer schema.
   - Current safeguard: B2C route `noindex`; trial route absent; checkout, trials and B2C sales disabled.
   - Required owner input: every field listed in `src/config/plans.ts`, verified rights and a tested fulfilment/payment route.
   - Resolution test: feature-gate unit tests, test-mode checkout tests, `npm run qa` and owner legal/commercial review.

4. **Third-party panel logo permissions are not documented.**
   - Evidence: seven supplied logo files had no written permission record.
   - Affected route: `/reseller-packages` and homepage package cards.
   - Current safeguard: logos removed from `public/` and retained in `docs/assets-pending-permission/server-logos/`; text names remain.
   - Required owner input: written rights/permission for each asset before re-publication.
   - Resolution test: image inventory and browser visual regression test.

---

## External verification required at deployment

- Live Vercel 308/410 behaviour, HTTPS hostname convergence, TLS, compression, cache headers and security headers cannot be proven by the local route-aware server.
- WhatsApp delivery after a visitor presses Send cannot be proven by this repository; the owner-confirmed destination and encoded hand-off are tested.
- `PUBLIC_GA4_ID` is intentionally absent. Analytics stays inactive until the production-only environment gate and an approved consent implementation are configured and tested.
- Search Console, Bing Webmaster Tools, CrUX/RUM, DNS, server logs and payment-provider account state are unknown from provided code.
