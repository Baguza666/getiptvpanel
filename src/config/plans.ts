export interface ResellerPackage {
  id: string;
  name: string;
  priceCurrency: 'GBP';
  pricePerCredit: number;
  minimumCredits: number;
  volumePricingAvailableAboveCredits: number;
  creditDefinition: string;
  priceStatement: string;
}

const sharedResellerTerms: Omit<ResellerPackage, 'id' | 'name' | 'pricePerCredit'> = {
  priceCurrency: 'GBP',
  minimumCredits: 10,
  volumePricingAvailableAboveCredits: 20,
  creditDefinition: 'One credit activates one 12-month subscription.',
  priceStatement: 'The displayed credit price is the full panel price. No tax, setup fee or separate panel fee is added.',
};

// Owner-supplied GBP base rates, confirmed on 2 August 2026.
// The listed unit rate applies through 20 credits. Orders above 20 receive a
// contact-only quote; no public volume schedule is intended.
export const resellerPackages: ResellerPackage[] = [
  { ...sharedResellerTerms, id: 'lion-ott', name: 'Lion OTT', pricePerCredit: 12 },
  { ...sharedResellerTerms, id: 'max-ott', name: 'Max OTT', pricePerCredit: 12 },
  { ...sharedResellerTerms, id: 'dream-4k', name: 'Dream 4K', pricePerCredit: 18 },
  { ...sharedResellerTerms, id: 'magnum-ott', name: 'Magnum OTT', pricePerCredit: 18 },
  { ...sharedResellerTerms, id: 'dino-iptv', name: 'Dino IPTV', pricePerCredit: 12 },
  { ...sharedResellerTerms, id: 'trex-iptv', name: 'TREX IPTV', pricePerCredit: 24 },
  { ...sharedResellerTerms, id: 'pro-max', name: 'PRO MAX', pricePerCredit: 24 },
];

export interface IndividualProduct {
  offerName?: string;
  territory?: string;
  distributionRightsReference?: string;
  supportedDevices?: string[];
  visiblePrice?: number;
  currency?: 'GBP';
  taxStatus?: string;
  billingFrequency?: string;
  renewalTerms?: string;
  cancellationTerms?: string;
  refundTerms?: string;
  fulfilmentMethod?: string;
  supportContact?: string;
  checkoutDestination?: string;
}

export const individualProduct: IndividualProduct = {};

export interface TrialConfiguration {
  trialPrice?: number;
  trialDuration?: string;
  eligibility?: string;
  includedFeatures?: string[];
  deviceLimit?: number;
  paymentRequirement?: string;
  renewalBehaviour?: string;
  cancellationMethod?: string;
  abuseControls?: string;
  supportTerms?: string;
}

export const trialConfiguration: TrialConfiguration = {};

export interface UpgradeCreditOffer {
  amountGbp?: number;
  eligibilityPeriod?: string;
  eligibleIndividualProduct?: string;
  targetResellerPackage?: string;
  terms?: string;
}

// Optional individual-to-reseller credit. It remains unpublished until every term validates.
export const upgradeCreditOffer: UpgradeCreditOffer = {};
