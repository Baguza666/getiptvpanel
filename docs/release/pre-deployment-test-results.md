# Pre-Deployment Test Results

**Date & Time:** 3 August 2026, 18:04 UTC  
**Environment:** Local Production Build Validation (`Node.js 25.9.0` / Astro 7 Static)

---

## 1. Test Command Execution Summary

| Command | Exit Code | Result | Duration | Notes / Coverage |
|---|---|---|---|---|
| `npm run check` | `0` | **PASSED** | 0.8s | 0 errors, 0 warnings across 66 Astro files |
| `npm run lint` | `0` | **PASSED** | 1.2s | ESLint code quality & typecheck passed |
| `npm test` | `0` | **PASSED** | 0.8s | 8 Vitest test suites, 16 unit tests passed 100% |
| `npm run build` | `0` | **PASSED** | 0.3s | Clean static build; 20 static pages generated in `dist/` |
| `npm run test:site` | `0` | **PASSED** | 0.4s | 19 HTML routes passed compliance, canonical, sitemap, metadata & link checks |
| `npm run test:e2e` | `0` | **PASSED** | 11.1s | 18 Playwright E2E and Axe-core accessibility tests passed 100% |
| `npm run qa` | `0` | **PASSED** | 15.2s | Full sequential production QA pipeline passed 100% |

---

## 2. Gate Verification Details

- **Contact Number Integrity:** Verified single owner contact number (`33644651365` / `+33644651365`). Placeholder number `447000000000` is 100% absent.
- **CTA Destinations:** Zero null/empty/undefined hrefs. Application form buttons use `<button>` elements with local JS handlers.
- **Tax Wording:** Qualified pricing statements applied sitewide (*"No separate panel or setup fee is added..."*).
- **Feature Gates:** `/individual-subscription/` is `noindex, follow` and excluded from `sitemap.xml`.
- **UK Legality Gate:** `/is-iptv-legal-in-the-uk/` is `noindex, follow` and excluded from `sitemap.xml`.
- **Favicons:** Verified `/iptvfavicon.png` across all page `<head>` elements and `site.webmanifest`.
