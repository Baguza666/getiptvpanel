# Vercel rollback runbook

Rollback immediately for persistent 5xx responses, broken lead routing, wrong pricing, index-wide `noindex`, incorrect production canonicals, redirect loops, analytics PII, exposed secrets or another security incident.

1. Stop further promotions and record the affected URL, time and deployment identifier.
2. In Vercel, open the last known-good production deployment and choose **Promote to Production**. This is the preferred recoverable rollback; do not alter DNS unless the incident specifically requires it.
3. Restore the prior reviewed environment-variable set if configuration caused the incident.
4. Run:

```sh
PUBLIC_SMOKE_BASE_URL=https://getiptvpanel.com npm run smoke:production
```

5. Confirm lead routing and analytics in their approved test modes; do not send a real customer message or payment.
6. Preserve logs and the failed deployment for root-cause review before a new release.

