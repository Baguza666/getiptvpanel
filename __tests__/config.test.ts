import { describe, expect, test } from 'vitest';
import { assertLaunchConfiguration, validateB2CLaunch, validateTrialLaunch, validateUpgradeCreditLaunch } from '../src/config/validation';
import type { FeatureFlags } from '../src/config/features';
import { resellerPackages } from '../src/config/plans';
import { contact, whatsAppHref } from '../src/config/contact';
import { assertHttpsUrl } from '../src/config/env';

const disabled: FeatureFlags = {
  b2bResellerEnabled: true, b2cIndividualEnabled: false, b2cRightsVerified: false,
  trialEnabled: false, directCheckoutEnabled: false, reviewsEnabled: false, upgradeCreditEnabled: false,
};

describe('commercial launch gates', () => {
  test('rejects unsafe public URLs', () => {
    expect(assertHttpsUrl(undefined, 'TEST_URL')).toBeUndefined();
    expect(assertHttpsUrl('https://example.com/path', 'TEST_URL')).toBe('https://example.com/path');
    expect(() => assertHttpsUrl('http://example.com', 'TEST_URL')).toThrow(/absolute HTTPS URL/);
    expect(() => assertHttpsUrl('https://user:secret@example.com', 'TEST_URL')).toThrow(/embedded credentials/);
  });
  test('keeps the owner-confirmed WhatsApp destination in a safe URL', () => {
    expect(contact.whatsAppNumber).toMatch(/^\d+$/);
    expect(contact.whatsAppNumber).not.toContain('447000000000');
    expect(contact.whatsAppOwnerConfirmed).toBe(true);
    expect(whatsAppHref('Pricing & terms')).toBe(
      `https://wa.me/${contact.whatsAppNumber}?text=Pricing%20%26%20terms`,
    );
  });

  test('stores the seven owner-supplied GBP base rates without inventing discount tiers', () => {
    expect(resellerPackages).toHaveLength(7);
    expect(resellerPackages.map(({ name, pricePerCredit }) => [name, pricePerCredit])).toEqual([
      ['Lion OTT', 12], ['Max OTT', 12], ['Dream 4K', 18], ['Magnum OTT', 18],
      ['Dino IPTV', 12], ['TREX IPTV', 24], ['PRO MAX', 24],
    ]);
    expect(resellerPackages.every((plan) =>
      plan.priceCurrency === 'GBP' &&
      plan.minimumCredits === 10 &&
      plan.volumePricingAvailableAboveCredits === 20 &&
      plan.creditDefinition === 'One credit activates one 12-month subscription.' &&
      plan.priceStatement === 'The displayed credit price is the full panel price. No tax, setup fee or separate panel fee is added.'
    )).toBe(true);
  });

  test('allow disabled B2C and reject enabled B2C with missing evidence', () => {
    expect(validateB2CLaunch(disabled, {})).toEqual([]);
    expect(validateB2CLaunch({ ...disabled, b2cIndividualEnabled: true }, {})).toEqual(expect.arrayContaining([
      'offer name', 'territory', 'distribution-rights reference', 'supported devices',
      'visible price', 'GBP currency', 'tax status', 'billing frequency', 'renewal terms',
      'cancellation terms', 'refund terms', 'fulfilment method', 'support contact',
      'checkout destination', 'B2C_RIGHTS_VERIFIED=true',
    ]));
    const complete = {
      offerName: 'Verified individual offer', territory: 'United Kingdom',
      distributionRightsReference: 'OWNER-RIGHTS-REFERENCE', supportedDevices: ['Supported device'],
      visiblePrice: 1, currency: 'GBP' as const, taxStatus: 'Owner-confirmed status',
      billingFrequency: 'One-off', renewalTerms: 'Owner-confirmed renewal terms',
      cancellationTerms: 'Owner-confirmed cancellation terms', refundTerms: 'Owner-confirmed refund terms',
      fulfilmentMethod: 'Owner-confirmed fulfilment', supportContact: 'Configured support route',
      checkoutDestination: 'https://example.com/test-checkout',
    };
    expect(validateB2CLaunch({ ...disabled, b2cIndividualEnabled: true, b2cRightsVerified: true }, complete)).toEqual([]);
    expect(() => assertLaunchConfiguration(
      { ...disabled, directCheckoutEnabled: true, b2cRightsVerified: true },
      complete,
      {},
      {},
    )).toThrow(/direct checkout requires B2C individual publication/);
  });

  test('requires all trial terms when trial publication is enabled', () => {
    expect(validateTrialLaunch(disabled, {})).toEqual([]);
    expect(validateTrialLaunch({ ...disabled, trialEnabled: true }, {})).toHaveLength(10);
  });

  test('requires amount, eligibility and terms before upgrade credit is enabled', () => {
    expect(validateUpgradeCreditLaunch(disabled, {})).toEqual([]);
    expect(validateUpgradeCreditLaunch({ ...disabled, upgradeCreditEnabled: true }, {})).toHaveLength(5);
  });
});
