export interface Claim {
  id: string;
  text: string;
  evidenceSource: string;
  verified: boolean;
  publicationStatus: 'publish' | 'hold';
}

export const claims: Claim[] = [
  {
    id: 'no-direct-checkout',
    text: 'Pricing and applications continue through WhatsApp; this website does not take payment.',
    evidenceSource: 'Current WhatsApp enquiry flow',
    verified: true,
    publicationStatus: 'publish',
  },
  {
    id: 'no-added-panel-fees',
    text: 'The displayed panel price has no added tax, setup fee or separate panel fee.',
    evidenceSource: 'Business owner statement, 3 August 2026',
    verified: true,
    publicationStatus: 'publish',
  },
  {
    id: 'uk-first-site',
    text: 'UK-first reseller onboarding and business-planning guidance.',
    evidenceSource: 'Public information architecture and en-GB page content',
    verified: true,
    publicationStatus: 'publish',
  },
  {
    id: 'reseller-base-rates',
    text: 'Owner-confirmed base rates from £12 per credit, with a 10-credit minimum.',
    evidenceSource: 'Business owner statement, 2 August 2026',
    verified: true,
    publicationStatus: 'publish',
  },
  {
    id: 'credit-duration-and-volume-threshold',
    text: 'One credit activates one 12-month subscription; larger orders may receive a lower quoted unit rate.',
    evidenceSource: 'Business owner statement, 2 August 2026',
    verified: true,
    publicationStatus: 'publish',
  },
];

export const publishedClaims = claims.filter(
  (claim) => claim.verified && claim.publicationStatus === 'publish',
);
