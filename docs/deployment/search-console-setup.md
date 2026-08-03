# Search Console and Bing setup

Perform these steps only after an approved production deployment.

1. Add and verify the Google Search Console Domain property for `getiptvpanel.com` through DNS.
2. Confirm that HTTP and `www` variants redirect directly to `https://getiptvpanel.com`.
3. Submit `https://getiptvpanel.com/sitemap.xml`.
4. Inspect `/`, `/reseller-panel`, `/reseller-packages`, `/become-a-reseller` and `/guides/fire-tv-setup`.
5. For each, confirm rendered HTML, the selected canonical and indexability.
6. Request indexing only for those priority canonical pages.
7. Confirm `/individual-subscription` and `/is-iptv-legal-in-the-uk` report `noindex` and are not in the sitemap.
8. Review Manual Actions, Security Issues, Page Indexing and Core Web Vitals reports.
9. Segment performance by page, query, United Kingdom and device; do not treat temporary movement as recovery or success.
10. If the owner chooses Bing Webmaster Tools, verify the domain and submit the same sitemap.

