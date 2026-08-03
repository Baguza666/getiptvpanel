# Pre-launch performance results

Measured on 3 August 2026 against the local static production build served by `scripts/preview-with-routes.mjs`. Tool: Lighthouse 13.4.1. These are lab measurements, not CrUX, Search Console or real-user field data.

## Results

| Route | Profile | Performance | Accessibility | SEO | FCP | LCP | TBT | CLS | Speed Index |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` | Mobile | 99 | 100 | 100 | 1,054 ms | 1,654 ms | 0 ms | 0 | 2,618 ms |
| `/reseller-panel` | Mobile | 100 | 100 | 100 | 1,052 ms | 1,502 ms | 0 ms | 0 | 2,408 ms |
| `/reseller-packages` | Mobile | 100 | 100 | 100 | 1,063 ms | 1,663 ms | 0 ms | 0 | 2,022 ms |
| `/guides/fire-tv-setup` | Mobile | 100 | 100 | 100 | 1,053 ms | 1,653 ms | 0 ms | 0 | 1,913 ms |
| `/` | Desktop | 100 | 100 | 100 | 290 ms | 402 ms | 0 ms | 0 | 445 ms |
| `/reseller-panel` | Desktop | 100 | 100 | 100 | 282 ms | 362 ms | 0 ms | 0 | 378 ms |
| `/reseller-packages` | Desktop | 100 | 100 | 100 | 283 ms | 403 ms | 0 ms | 0 | 309 ms |
| `/guides/fire-tv-setup` | Desktop | 100 | 100 | 100 | 282 ms | 402 ms | 0 ms | 0 | 302 ms |

The individual route was not performance-tested as an enabled offer because B2C is disabled and the page is `noindex`.

## Build profile

- Total `dist/`: approximately 816 KiB.
- Compiled Astro assets: approximately 236 KiB.
- Largest JavaScript asset: 184,034 bytes, associated with the React calculator client path.
- Shared compiled CSS: 38,307 bytes.
- Social image: 76,410 bytes.
- No generated source-map files were present in `dist/`.

## Before and after

The untouched baseline did not have Lighthouse installed and no comparable Lighthouse JSON was captured before the audit changes. Baseline production build, built-site tests and 14 browser tests passed. The measured after values above are therefore the first reproducible lab baseline; no before/after performance improvement is claimed.

## Interpretation and limitations

Google's current good field thresholds remain LCP at or below 2.5 seconds, INP at or below 200 milliseconds and CLS at or below 0.1 at the 75th percentile, assessed separately for mobile and desktop: https://web.dev/articles/vitals

- Lighthouse TBT is not INP and is not reported as such.
- Local server response time, cache headers and network distance do not represent Vercel production.
- No CrUX, RUM or Search Console field data was supplied.
- Run PageSpeed Insights and review Search Console Core Web Vitals after deployment before making field-performance claims.
