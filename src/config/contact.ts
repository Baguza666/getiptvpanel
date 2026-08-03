import { assertHttpsUrl, cleanPublicValue } from './env';

const existingWhatsAppNumber = '33644651365';
const configuredWhatsAppNumber = cleanPublicValue(import.meta.env.PUBLIC_WHATSAPP_NUMBER)?.replace(/[^0-9]/g, '');
const whatsAppNumber = configuredWhatsAppNumber || existingWhatsAppNumber;
if (!/^\d{8,15}$/.test(whatsAppNumber)) throw new Error('PUBLIC_WHATSAPP_NUMBER must contain 8 to 15 digits.');
const ga4Id = cleanPublicValue(import.meta.env.PUBLIC_GA4_ID);
if (ga4Id && !/^G-[A-Z0-9]+$/i.test(ga4Id)) throw new Error('PUBLIC_GA4_ID must use a GA4 G- identifier.');

export const contact = {
  whatsAppNumber,
  whatsAppOwnerConfirmed: true,
  checkoutUrl: assertHttpsUrl(import.meta.env.PUBLIC_CHECKOUT_URL, 'PUBLIC_CHECKOUT_URL'),
  ga4Id,
  analyticsEnvironment: cleanPublicValue(import.meta.env.PUBLIC_ANALYTICS_ENVIRONMENT),
} as const;

export const whatsAppHref = (message: string) =>
  `https://wa.me/${contact.whatsAppNumber}?text=${encodeURIComponent(message)}`;
