import type { FeatureFlags } from './features';
import type { IndividualProduct, TrialConfiguration, UpgradeCreditOffer } from './plans';

const present = (value: unknown) =>
  value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0);

export function validateB2CLaunch(flags: FeatureFlags, product: IndividualProduct): string[] {
  if (!flags.b2cIndividualEnabled && !flags.directCheckoutEnabled) return [];

  const required: Array<[keyof IndividualProduct, string]> = [
    ['offerName', 'offer name'],
    ['territory', 'territory'],
    ['distributionRightsReference', 'distribution-rights reference'],
    ['supportedDevices', 'supported devices'],
    ['visiblePrice', 'visible price'],
    ['currency', 'GBP currency'],
    ['taxStatus', 'tax status'],
    ['billingFrequency', 'billing frequency'],
    ['renewalTerms', 'renewal terms'],
    ['cancellationTerms', 'cancellation terms'],
    ['refundTerms', 'refund terms'],
    ['fulfilmentMethod', 'fulfilment method'],
    ['supportContact', 'support contact'],
    ['checkoutDestination', 'checkout destination'],
  ];

  const missing = required.filter(([key]) => !present(product[key])).map(([, label]) => label);
  if (!flags.b2cRightsVerified) missing.push('B2C_RIGHTS_VERIFIED=true');
  return missing;
}

export function validateTrialLaunch(flags: FeatureFlags, trial: TrialConfiguration): string[] {
  if (!flags.trialEnabled) return [];
  const required: Array<[keyof TrialConfiguration, string]> = [
    ['trialPrice', 'trial price'],
    ['trialDuration', 'trial duration'],
    ['eligibility', 'eligibility'],
    ['includedFeatures', 'included features'],
    ['deviceLimit', 'device limit'],
    ['paymentRequirement', 'payment requirement'],
    ['renewalBehaviour', 'conversion or renewal behaviour'],
    ['cancellationMethod', 'cancellation method'],
    ['abuseControls', 'abuse controls'],
    ['supportTerms', 'support terms'],
  ];
  return required.filter(([key]) => !present(trial[key])).map(([, label]) => label);
}

export function validateUpgradeCreditLaunch(flags: FeatureFlags, offer: UpgradeCreditOffer): string[] {
  if (!flags.upgradeCreditEnabled) return [];
  const required: Array<[keyof UpgradeCreditOffer, string]> = [
    ['amountGbp', 'GBP credit amount'],
    ['eligibilityPeriod', 'eligibility period'],
    ['eligibleIndividualProduct', 'eligible individual product'],
    ['targetResellerPackage', 'target reseller package'],
    ['terms', 'upgrade-credit terms'],
  ];
  return required.filter(([key]) => !present(offer[key])).map(([, label]) => label);
}

export function assertLaunchConfiguration(
  flags: FeatureFlags,
  product: IndividualProduct,
  trial: TrialConfiguration,
  upgradeCredit: UpgradeCreditOffer,
): void {
  const errors = [
    ...(flags.directCheckoutEnabled && !flags.b2cIndividualEnabled
      ? ['B2C: direct checkout requires B2C individual publication']
      : []),
    ...validateB2CLaunch(flags, product).map((item) => `B2C: ${item}`),
    ...validateTrialLaunch(flags, trial).map((item) => `Trial: ${item}`),
    ...validateUpgradeCreditLaunch(flags, upgradeCredit).map((item) => `Upgrade credit: ${item}`),
  ];

  if (errors.length) {
    throw new Error(`Unsafe commercial launch configuration. Missing ${errors.join(', ')}.`);
  }
}
