import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import reactRenderer from '@astrojs/react/server.js';
import { expect, test } from 'vitest';
import HomePage from '../src/pages/index.astro';
import PanelPage from '../src/pages/reseller-panel.astro';
import PackagesPage from '../src/pages/reseller-packages.astro';
import BecomePage from '../src/pages/become-a-reseller.astro';
import ProfitPage from '../src/pages/profit-calculator.astro';
import IndividualPage from '../src/pages/individual-subscription.astro';
import LegalPage from '../src/pages/is-iptv-legal-in-the-uk.astro';
import GuidePage from '../src/pages/guides/fire-tv-setup.astro';

test('core routes render British-English commercial and compliance content', async () => {
  const container = await AstroContainer.create();
  container.addServerRenderer({ renderer: reactRenderer });
  container.addClientRenderer({ name: '@astrojs/react', entrypoint: '@astrojs/react/client.js' });

  const pages = await Promise.all([
    container.renderToString(HomePage), container.renderToString(PanelPage),
    container.renderToString(PackagesPage), container.renderToString(BecomePage),
    container.renderToString(ProfitPage), container.renderToString(IndividualPage),
    container.renderToString(LegalPage), container.renderToString(GuidePage),
  ]);

  expect(pages[0]).toContain('IPTV Reseller Panel for UK Reseller Businesses');
  expect(pages[0]).toContain('Estimate the numbers before buying credits');
  expect(pages[0]).toContain('/getiptvlogo.png');
  expect(pages[1]).toContain('See How the IPTV Reseller Panel Works');
  expect(pages[2]).toContain('Compare IPTV Reseller Credit Packages');
  expect(pages[2]).toContain('Lion OTT');
  expect(pages[2]).not.toContain('/servers/');
  expect(pages[2]).toContain('£12');
  expect(pages[3]).toContain('How to Become an IPTV Reseller with a Clear Operating Plan');
  expect(pages[3]).toContain('privacy policy');
  expect(pages[4]).toContain('Estimate IPTV Reseller Revenue, Costs and Margin');
  expect(pages[5]).toContain('Looking for One IPTV Subscription?');
  expect(pages[6]).toContain('Is IPTV Legal in the UK?');
  expect(pages[7]).toContain('Fire TV');

  const combined = pages.join('\n');
  expect(combined).not.toMatch(/(?:>Devenir |Mentions Légales|Politique de Confidentialité|Chaînes HD|Bénéfice net)/i);
  expect(combined).not.toMatch(/(?:99\.9%|20,000\+|100,000\+|zero buffering|anti-freeze|guaranteed income)/i);
  expect(combined).not.toMatch(/(?:unknown from provided code|to be confirmed|not configured|would render here|\bpending\b|not applicable)/i);
});
