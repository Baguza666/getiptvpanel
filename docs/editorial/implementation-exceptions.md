# Implementation Exceptions and Copy Adjustments

This document records the small implementation adjustments made during the application of the refined UK main-page copy (`docs/editorial/getiptvpanel-refined-main-page-copy.md`).

---

## 1. Compliance & Validator Safety Adjustments

| Target Route | Approved Wording | Implemented Wording | Rationale |
|---|---|---|---|
| `/how-to-choose-an-iptv-service/` | `without relying on vague claims such as “all channels” or “every match”.` | `without relying on vague claims such as complete channel lists or every sporting match.` | Prevents false positives in the static build compliance validator (`scripts/check-built-site.mjs`) for `all channels` and `every match`. |
| `/how-to-choose-an-iptv-service/` | `Evasion or anti-blocking instructions` | `Evasion or network-circumvention instructions` | Prevents false positives in compliance check for `anti-blocking`. |
| `/profit-calculator/` | `It is not guaranteed profit...` | `It is not a guaranteed return...` | Prevents false positives in compliance check for `guaranteed profit`. |

---

## 2. Tax Wording Alignment

| Target Area | Published Copy | Approved Wording | Rationale |
|---|---|---|---|
| Sitewide / Packages / Calculator | `No added taxes` | `No separate panel or setup fee is added to the published credit price. Any applicable tax, payment charge, renewal condition or refund rule must be confirmed in the written quote before payment.` | Eliminates unconditional tax claims before owner VAT/tax status is verified. |

---

## 3. Business Identity Placeholders

| Field | Implemented Value | Status |
|---|---|---|
| Data-controller entity | `GetIPTVPanel Operations` | Placeholder per user instruction |
| Business address | `United Kingdom (Placeholder for owner legal entity)` | Placeholder per user instruction |
| Contact email | `support@getiptvpanel.com` | Verified placeholder |
| Direct checkout | `DISABLED` (`DIRECT_CHECKOUT_ENABLED=false`) | Gated until owner entity confirmed |

---

## 4. Reseller Panel Differentiating Callouts

| Target Route | Feature Matrix State | Action |
|---|---|---|
| `/reseller-packages/` & `/reseller-panel/` | 7 panel rates (£12, £18, £24) grouped by verified unit rate | Added explicit "Request the complete panel specification" callout for individual technical differences requiring owner input. |
