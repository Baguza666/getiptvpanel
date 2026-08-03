import { assertHttpsUrl } from './env';
import { features } from './features';

const productionOrigin = 'https://getiptvpanel.com';
const configuredOrigin = assertHttpsUrl(import.meta.env.PUBLIC_SITE_URL, 'PUBLIC_SITE_URL')?.replace(/\/$/, '');
if (configuredOrigin && configuredOrigin !== productionOrigin) {
  throw new Error(`PUBLIC_SITE_URL must use the canonical production origin ${productionOrigin}.`);
}

export const site = {
  name: 'GetIPTVPanel',
  operator: 'GetIPTVPanel Operations',
  contactEmail: 'support@getiptvpanel.com',
  address: 'GetIPTVPanel Operations, United Kingdom (Placeholder for owner legal entity)',
  url: configuredOrigin ?? productionOrigin,
  locale: 'en_GB',
  language: 'en-GB',
  market: 'United Kingdom',
  currency: 'GBP',
  updatedDate: '3 August 2026',
  description:
    'UK-focused reseller-panel guidance, package enquiries and practical onboarding for IPTV and OTT account-management businesses.',
} as const;

const primaryNavigationItems = [
  { href: '/reseller-panel', label: 'Reseller Panel' },
  { href: '/reseller-packages', label: 'Packages' },
  { href: '/become-a-reseller', label: 'Start Reselling' },
  { href: '/guides', label: 'Resources' },
  ...(features.b2cIndividualEnabled ? [{ href: '/individual-subscription', label: 'Individual Plan' }] : []),
  { href: '/support', label: 'Support' },
] as const;

export const primaryNavigation = primaryNavigationItems;

export const indexableRoutes = [
  '/',
  '/reseller-panel',
  '/reseller-packages',
  '/become-a-reseller',
  '/profit-calculator',
  '/how-to-choose-an-iptv-service',
  '/guides',
  '/guides/tivimate-setup',
  '/guides/iptv-smarters-setup',
  '/guides/fire-tv-setup',
  '/about',
  '/contact',
  '/support',
  '/privacy-policy',
  '/terms',
  '/refund-policy',
  '/acceptable-use',
] as const;

export const noindexRoutes = [
  ...(!features.b2cIndividualEnabled ? ['/individual-subscription'] : []),
  // Official sources were checked on 3 August 2026. Keep the legal article out
  // of the index until the owner records a qualified legal review.
  '/is-iptv-legal-in-the-uk',
] as const;
