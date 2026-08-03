# Analytics and conversion event contract

Analytics is disabled unless both `PUBLIC_GA4_ID` and `PUBLIC_ANALYTICS_ENVIRONMENT=production` are configured and the visitor grants consent. Vercel previews suppress loading. No approved consent-platform or legal assessment was supplied; owner/legal review remains required before enabling GA4.

| Event | Trigger/status |
|---|---|
| `page_view` | Once when consented analytics loads. |
| `reseller_primary_cta_click` | Primary reseller CTA. |
| `reseller_packages_view` | Once on the package route after analytics loads. |
| `reseller_package_select` | Reserved for a future verified package-selection control. |
| `reseller_form_start` | First focus within a reseller form. |
| `reseller_form_submit` | Valid form hand-off to WhatsApp; not a delivered lead claim. |
| `reseller_form_error` | First invalid attempt or missing destination. |
| `panel_demo_open` | User opens the labelled panel walkthrough. |
| `profit_calculator_start` | First calculator input or calculator CTA. |
| `profit_calculator_complete` | Visitor requests a completed estimate. |
| `individual_page_view` | Gated individual route view when analytics is active. |
| `individual_availability_click` | Reserved; direct individual availability is disabled. |
| `individual_checkout_start` / `individual_purchase` | Reserved; checkout is disabled. Purchase must be deduplicated if later implemented. |
| `reseller_upsell_view` / `reseller_upsell_click` | B2C/guide bridge exposure or action. |
| `reseller_application_from_b2c` | Disabled individual route moves to a reseller enquiry. |
| `trial_start` | Reserved; trial is disabled. |
| `guide_cta_click` | Setup-guide CTA. |
| `whatsapp_click` | Outbound WhatsApp action; may accompany a more specific event. |
| `email_click` | Reserved; no email route is configured. |
| `support_click` | Support action where tagged. |

Allowed properties are page path, CTA placement, package ID, sanitised traffic source, sanitised campaign, coarse device category, lead origin and calculator completion state. Names, email addresses, telephone/WhatsApp numbers, credentials, playlist URLs, payment data and prepared messages are never passed.

UTM source/medium/campaign are stripped to 64 safe token characters. Landing path and referrer origin are retained in session storage for the user-visible WhatsApp hand-off; the full referrer URL and query string are not retained.

The browser suite uses a fake GA4 identifier, blocks the network request, confirms one `page_view` and one route event, and checks the captured event payload for disallowed PII keys.

