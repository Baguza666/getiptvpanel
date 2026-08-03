import fs from 'node:fs';
import { expect, test } from 'vitest';

test('analytics contract contains every required event and excludes PII properties', () => {
  const source = fs.readFileSync('src/components/Analytics.astro', 'utf8');
  const requiredEvents = [
    'page_view', 'reseller_primary_cta_click', 'reseller_packages_view',
    'reseller_package_select', 'reseller_form_start', 'reseller_form_submit',
    'reseller_form_error', 'panel_demo_open', 'profit_calculator_start',
    'profit_calculator_complete', 'individual_page_view',
    'individual_availability_click', 'individual_checkout_start',
    'individual_purchase', 'reseller_upsell_view', 'reseller_upsell_click',
    'reseller_application_from_b2c', 'trial_start', 'guide_cta_click',
    'whatsapp_click', 'email_click', 'support_click',
  ];
  for (const event of requiredEvents) expect(source).toContain(`'${event}'`);

  const safePropertyBlock = source.match(/const candidateProperties = \{([\s\S]*?)\n\s*\};/)?.[1] ?? '';
  expect(safePropertyBlock).not.toMatch(/\b(?:name|email|phone|telephone|message|credentials|playlist|payment)\b/i);
  expect(source).toContain("contact.analyticsEnvironment === 'production'");
});

test('lead application never places applicant PII in the WhatsApp URL', () => {
  const source = fs.readFileSync('src/components/LeadForm.astro', 'utf8');
  expect(source).toContain('data-message-summary');
  expect(source).toContain('https://wa.me/${contact.whatsAppNumber}');
  expect(source).not.toContain('encodeURIComponent(message)');
  expect(source).not.toContain('window.location.assign');
});
