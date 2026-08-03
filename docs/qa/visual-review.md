# Visual and responsive review

## Automated production-browser coverage

The Playwright Chromium suite checks all 19 public HTML routes at 360×800, 375×812, 390×844, 812×375, 768×1024, 1024×768, 1440×900 and 1680×1050. It verifies status, one H1, no horizontal overflow and no console/page errors. At 375px it runs axe on every route; it also checks 200% text resize, 44px controls, focus visibility, reduced motion, mobile-menu focus containment, form validation, package-name layout, calculator negative states, migration responses, noindex gates and analytics dispatch.

## Asset inspection

- `public/getiptvlogo.png`: GetIPTVPanel wordmark only; no protected broadcaster, league, club or event artwork visible.
- `public/og-card.png`: repository-branded panel-rate/onboarding graphic; no third-party service artwork visible.
- Seven unverified third-party panel logos were removed from `public/` and retained under `docs/assets-pending-permission/server-logos/`.

## Manual in-app browser limitation

The in-app browser exposed no available target, so the required side-by-side manual inspection and screenshots could not be performed in this workspace. The browser skill explicitly prevents substituting another interactive browser surface. Automated Chromium and direct asset inspection passed, but final human visual acceptance on a Vercel preview remains required before production approval.

The owner should inspect homepage, panel, packages, application, calculator, disabled individual page, one guide, contact, policies, 404, mobile menu, invalid form state and consent banner at 360×800, 390×844, 768×1024 and 1440×900.
