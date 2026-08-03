# GetIPTVPanel Production Release Report

**Release Date & Time:** 3 August 2026, 18:10 UTC  
**Release Commit SHA:** `972457e`  
**Previous Production Commit SHA:** `ad5c99e`  
**GitHub Production Branch:** `main`  
**Vercel Deployment ID:** `dpl_H3k4tJ6n4Pz96pQqp9fdsx9f` (`getiptvpanel-qp9fdsx9f-hichambitious-8091s-projects.vercel.app`)  
**Vercel Production URL:** `https://getiptvpanel.com`  

---

## 1. Executive Summary

The production site `https://getiptvpanel.com` has been successfully updated with the complete UK-first, B2B reseller panel experience. The code was tested locally across unit, static build, compliance, and browser E2E test suites before being committed and pushed to GitHub `main`. The push triggered an automatic Vercel production deployment which built, verified, and assigned the production domain alias cleanly.

---

## 2. Release Metrics & Production Verification

- **Production Build Result:** PASSED (20 static pages generated in `dist/`)
- **Production Smoke-Test Result:** PASSED (`https://getiptvpanel.com` returning HTTP 200, valid H1, canonicals, security headers, updated `/iptvfavicon.png`, and verified WhatsApp contact `+33644651365`)
- **Indexable URL Count:** 17
- **Noindex URL Count:** 2 (`/individual-subscription/`, `/is-iptv-legal-in-the-uk/`)
- **Sitemap URL Count:** 17 (Valid XML at `https://getiptvpanel.com/sitemap.xml`)
- **Legacy Redirect Count:** 5 direct 301 redirects
- **Legacy Removal Count:** 12 obsolete French content URLs returning 410 Gone
- **Structured-Data Types:** `Organization`, `WebSite`, `BreadcrumbList`, `Article`
- **P0 Count:** 0
- **P1 Count:** 0
- **P2 Count:** 0

---

## 3. Search Engine Readiness

- **Robots.txt:** Serves `User-agent: * Allow: /` with Sitemap directive (`https://getiptvpanel.com/sitemap.xml`).
- **Sitemap.xml:** Serves 17 canonical indexable `https://getiptvpanel.com` URLs with zero noindex or 404 URLs.
- **Search Console Status:** Domain property readiness documented; sitemap URL ready for submission via Google Search Console and Bing Webmaster Tools upon owner login.

---

## 4. Rollback Reference

- **Previous Commit SHA:** `ad5c99e`
- **Previous Vercel Deployment ID:** `dpl_defmhkudw`
- **Rollback Procedure:** Redeploy previous deployment ID `dpl_defmhkudw` via Vercel dashboard/CLI or run `git revert 972457e` and push to `main`.
