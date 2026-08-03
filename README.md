# GetIPTVPanel UK website

Static-first Astro website for UK reseller-panel enquiries, package qualification, reseller onboarding, business estimates and official-store player setup guidance.

## Stack and deployment

- Astro 7 static rendering
- React 19 for the profit-calculator island
- Tailwind CSS 4 plus project component styles
- npm and Node.js 22.12+
- Vercel static hosting

The framework was retained because it provides crawlable HTML, a small client bundle and direct compatibility with the existing Vercel deployment.

## Interface system

The visual language treats the site as a UK reseller-operations workspace rather than a consumer streaming shop: deep ink operational surfaces, warm paper content areas, chartreuse actions, grouped GBP rate cards, a live hero calculator and the owner-supplied GetIPTVPanel and server logos. Shared tokens and component rules are documented in `design-system/getiptvpanel/MASTER.md`; the primary implementation is in `src/styles/global.css`.

The homepage, reseller packages, panel walkthrough, reseller application, calculator, contact and support routes use distinct information structures instead of repeating one generic card grid. The brand mark, favicon and 1200×630 social card follow the same system.

## Local commands

```sh
npm ci
npm run check
npm test
npm run build
npm run test:site
npm run dev
```

Run the full release suite with:

```sh
npm run qa
```

## Configuration

Copy `.env.example` to `.env.local` and supply environment-specific values. Never commit secrets.

- `PUBLIC_SITE_URL`: canonical production origin.
- `PUBLIC_WHATSAPP_NUMBER`: digits-only WhatsApp number.
- `PUBLIC_GA4_ID`: optional consent-gated GA4 identifier.
- `PUBLIC_ANALYTICS_ENVIRONMENT`: set to `production` only in the approved production environment; analytics stays disabled otherwise.
- `PUBLIC_B2C_SALES_ENABLED`: alias for the individual-sales feature gate; both B2C flags default to false.
- Commercial flags default to B2B on and B2C/trial/checkout/reviews off.

Commercial facts live in `src/config/`. `src/config/launch.ts` stops a build when B2C or trial publication is enabled without required evidence and terms.

The reseller catalogue currently contains seven owner-supplied GBP base rates. Every option has a 10-credit minimum and one credit activates one 12-month subscription. At exactly 20 credits, the total is the listed unit rate multiplied by 20. Larger orders use a contact-only quote rather than a public discount schedule. The owner states that no taxes are added and that unused-credit expiry, recharge, renewal and refund conditions are not applicable; legal review remains separate from recording those statements.

## WhatsApp enquiries

Every pricing, application, availability and support conversion uses the configured WhatsApp route. The reseller application builder validates required fields locally and prepares a copyable summary in the visitor's browser. The WhatsApp link contains no applicant details; the visitor chooses whether to paste and send the summary. The website has no email contact route, lead API, webhook or CRM integration and does not receive the application data.

## SEO and migration

- Root locale is `en-GB`; canonical URLs have no trailing slash.
- `src/pages/sitemap.xml.ts` includes 17 canonical, indexable pages in the default safe configuration.
- The disabled individual route and the UK legality article are `noindex`; the latter requires a recorded qualified legal review.
- Vercel handles eight direct legacy redirects and eleven 410 removals.
- Migration data and tests live in `docs/migration/`.
- No Product, Offer, Review, rating or FAQ schema is emitted while commercial data is unverified.
- Unverified third-party panel logos are excluded from `public/` and retained under `docs/assets-pending-permission/`.

## Production deployment

After configuring Vercel environment variables and passing `npm run qa`:

```sh
npx vercel pull --yes --environment=production
npx vercel build --prod
npx vercel deploy --prebuilt --prod
```

Do not enable B2C, checkout or trials merely to make a route appear. Resolve the corresponding launch blockers first.
