# Copy Extraction Validation Report

Validated on 3 August 2026 against production build output in `dist/`.

## Validation Checks Performed

1. **Route Coverage**: All 20 defined priority routes inspected and processed (19 static HTML pages + 1 feature-gated disabled route).
2. **Metadata Integrity**: Verified `<title>`, `<meta name="description">`, `rel="canonical"`, `meta name="robots"`, and Open Graph tags across every generated page file.
3. **Structured Data Validation**: Verified JSON-LD graphs (`Organization`, `WebSite`, `BreadcrumbList`, `Article`) for JSON syntax and visible content match.
4. **Exact Wording & Disclaimer Preservation**: Extracted text preserves exact wording, British English spelling (`en-GB`), formatting, button labels, and legal footers.
5. **No Source Modification**: Confirmed zero edits to production `src/` source code, page components, or configuration files during the extraction process.
6. **Build Pipeline Stability**: `npm run build` and `npm run test:site` executed cleanly with 100% pass rate.

## Commands Executed

```sh
npm run build
node scripts/generate-content-review.mjs
npm run test:site
```

## Verification Result
- **Status**: PASSED (All 20 review files created under `docs/content-review/pages/`).
