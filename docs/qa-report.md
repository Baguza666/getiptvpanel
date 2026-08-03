# QA report

## Baseline before the UK rebuild

- `npm test`: passed 4/4 test files and 4/4 tests.
- `npm run build`: passed; generated 14 routes from the uncommitted French baseline.
- No lint or type-check script existed.
- `npm audit --audit-level=moderate`: failed with 10 advisories (8 high, 2 low), affecting the Astro/Vite toolchain and transitive packages.

## Final automated results

Executed on 3 August 2026 with Node.js 25.9.0. The project declares Node.js 22.12 or newer.

- `npm run check`: pass. Astro checked 61 files with 0 errors, 0 warnings and 0 hints.
- `npm run lint`: pass. ESLint reported no findings.
- `npm test`: pass. 7 test files and 13 tests passed.
- `npm run build`: pass. Astro produced 19 indexable HTML routes, `404.html` and `sitemap.xml`; it reported 20 page entries.
- `npm run test:site`: pass. All 19 indexable routes passed unique-title, unique-description, H1, `en-GB`, canonical, JSON-LD, gated-schema, forbidden-claim, sitemap and internal-link checks.
- `npx playwright test`: pass. Chromium tests cover all 19 public routes at 375×812, 812×375, 768×1024, 1024×768, 1440×900 and 1680×1050; axe scans every route at narrow width; native form validation; WhatsApp message preparation; mobile-menu focus containment, active state, Escape return and desktop-resize recovery; 200% text resizing; touch targets; focus and hover stability; reduced motion; negative calculator output; all seven supplied server logos in equal DOM boxes with `object-fit: contain`; console/page errors; redirects; 410 and 404.
- `npm audit --audit-level=moderate`: pass. 0 vulnerabilities reported after the Astro 7/Vite 8 integration upgrade.
- Production output: 900 KB total in the local build after removing 42 unused legacy channel-logo assets. Shared React client chunk is 180 KB; calculator chunk is 7.0 KB; compiled CSS is 37 KB. The homepage calculator is plain JavaScript and does not load the React calculator island. No claim is made about transferred or compressed size.
- Social card: verified at 1200×630 pixels.
- Supplied brand assets: the 388×121 website logo and all seven server logos are present in the production build with declared dimensions; server marks use 5–23 KB WebP files and lazy loading.

## Intermediate issues and resolution

- The initial Playwright run could not launch because its newly installed headless-shell download was incomplete. The missing browser shell was installed, then the same suite ran.
- One mobile-navigation test locator stopped matching after the button correctly changed its accessible name from “Open navigation” to “Close navigation”. The locator was corrected to use the stable element ID and assert both accessible states. The product interaction did not change.
- Astro 7 initially failed to build because the legacy package override forced Vite 7. Astro 7 requires Vite 8; the override was removed and the official React and Tailwind integrations were upgraded together. The final build and all tests pass.
- The redesign verification initially found low-contrast green sequence labels, a tablet-width navigation overflow, an overly broad section accessible name, an unlabelled fixed mobile CTA landmark and non-focusable horizontally scrollable tables. The colours, breakpoint, heading IDs, landmark and table focus treatment were corrected; the expanded suite now passes.

## Accessibility and responsive checks

- Automated axe scans on all 19 public routes at 375px: 0 violations.
- Semantic landmarks, skip link, one H1 per indexable route, labelled form fields, native controls, live form status, keyboard-operable accordions and visible focus styles are implemented.
- Commercial buttons and form controls have at least 44–48px target heights.
- `prefers-reduced-motion` disables meaningful transition duration, and the browser flow ran with reduced motion enabled.
- No horizontal overflow was found on any of the 19 public routes at 375×812, 812×375, 768×1024, 1024×768, 1440×900 or 1680×1050. The same routes were checked at 375px with the root text size increased to 200%.

## Known QA limitations

- The website intentionally has no email route, lead endpoint, webhook or CRM. Chromium verifies native validation and the encoded WhatsApp destination/message; delivery after the visitor presses Send is controlled by WhatsApp and cannot be verified from this website.
- Live 308/410 status behaviour requires a Vercel preview or deployment. The route-aware local preview and `vercel.json` configuration tests pass, but they do not claim a live-edge result.
- Rights, complete panel operating terms and business legal details cannot be verified through code. The owner supplied the seven GBP prices, confirmed that exactly 20 credits use the listed rate multiplied by 20, retained larger-order prices as contact-only, stated that the displayed price has no tax, setup fee or separate panel fee, and confirmed WhatsApp as the sole contact route.
- The in-app visual browser exposed no available browser target in this workspace, so side-by-side manual visual inspection was not performed. The Chromium DOM, interaction, responsive and accessibility suites passed; no manual browser visual-review claim is made.
- Final human visual acceptance remains a required check on the Vercel preview/production URL at the target viewport sizes.
- Lighthouse was not installed. Axe and the built-output checks were used as the available accessibility/performance equivalents; no Lighthouse score is claimed.
