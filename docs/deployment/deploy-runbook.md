# Vercel deployment runbook

## Preconditions

- Obtain explicit owner approval and resolve every P0 in `docs/launch-blockers.md`.
- Review production environment values. Do not enable B2C, checkout or trials to make a route appear.
- Run the complete release suite from a clean dependency install.

## Required environment values

```text
PUBLIC_SITE_URL=https://getiptvpanel.com
PUBLIC_WHATSAPP_NUMBER=<owner-confirmed digits only>
PUBLIC_B2B_RESELLER_ENABLED=true
PUBLIC_B2C_INDIVIDUAL_ENABLED=false
PUBLIC_B2C_SALES_ENABLED=false
PUBLIC_B2C_RIGHTS_VERIFIED=false
PUBLIC_TRIAL_ENABLED=false
PUBLIC_DIRECT_CHECKOUT_ENABLED=false
PUBLIC_REVIEWS_ENABLED=false
PUBLIC_UPGRADE_CREDIT_ENABLED=false
PUBLIC_GA4_ID=<blank until approved, otherwise a G- identifier>
PUBLIC_ANALYTICS_ENVIRONMENT=<blank until approved, otherwise production>
PUBLIC_CHECKOUT_URL=<blank while checkout is disabled>
```

## Build and deploy

```sh
npm ci
npm run qa
npx vercel pull --yes --environment=production
npx vercel build --prod
npx vercel deploy --prebuilt --prod
```

The final command mutates production and requires explicit owner approval. This audit did not run it.

## Production smoke test

```sh
PUBLIC_SMOKE_BASE_URL=https://getiptvpanel.com npm run smoke:production
```

The smoke script checks public route, robots, sitemap, canonical, noindex, redirect and removal behaviour without submitting a lead or payment.

