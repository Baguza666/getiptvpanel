# Post-launch monitoring

## Immediately

- Run the production smoke command and inspect homepage/core route status, robots, sitemap, canonicals, schema, direct redirects, 410 responses, custom 404 and mobile navigation.
- Confirm no production page contains a staging hostname or accidental `noindex`.
- Test the WhatsApp hand-off with owner-approved test details; verify analytics using DebugView without PII.
- Check Vercel build/runtime logs, TLS and response headers.

## First 24 hours

- Check 4xx/5xx trends, lead hand-off reports, analytics event counts and security alerts.
- Verify Search Console, submit the sitemap and inspect priority URLs and selected canonicals.
- If checkout is still disabled, confirm no checkout event or link appears.

## First seven days

- Monitor crawl activity, indexation, redirects, 404/410 requests, branded/non-branded impressions, landing-page conversion, reseller form completion and mobile performance.
- Investigate anomalies without treating normal migration volatility as success or failure.

## First 30 days

- Compare crawl, indexation, impressions, clicks, qualified leads and any later verified revenue separately.
- Improve pages only from actual query, support and conversion evidence. Do not publish bulk keyword pages, buy links, use PBNs or create fake reviews.

Rollback triggers are persistent 5xx responses, broken lead delivery, broken/incorrect checkout, wrong pricing, index-wide `noindex`, incorrect canonicals, redirect loops, a security incident or a major conversion-path failure.
