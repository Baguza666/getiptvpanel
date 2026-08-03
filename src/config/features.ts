import { parseBoolean } from './env';

export interface FeatureFlags {
  b2bResellerEnabled: boolean;
  b2cIndividualEnabled: boolean;
  b2cRightsVerified: boolean;
  trialEnabled: boolean;
  directCheckoutEnabled: boolean;
  reviewsEnabled: boolean;
  upgradeCreditEnabled: boolean;
}

export const features: FeatureFlags = {
  b2bResellerEnabled: parseBoolean(import.meta.env.PUBLIC_B2B_RESELLER_ENABLED, true),
  b2cIndividualEnabled:
    parseBoolean(import.meta.env.PUBLIC_B2C_SALES_ENABLED, false) ||
    parseBoolean(import.meta.env.PUBLIC_B2C_INDIVIDUAL_ENABLED, false),
  b2cRightsVerified: parseBoolean(import.meta.env.PUBLIC_B2C_RIGHTS_VERIFIED, false),
  trialEnabled: parseBoolean(import.meta.env.PUBLIC_TRIAL_ENABLED, false),
  directCheckoutEnabled: parseBoolean(import.meta.env.PUBLIC_DIRECT_CHECKOUT_ENABLED, false),
  reviewsEnabled: parseBoolean(import.meta.env.PUBLIC_REVIEWS_ENABLED, false),
  upgradeCreditEnabled: parseBoolean(import.meta.env.PUBLIC_UPGRADE_CREDIT_ENABLED, false),
};
