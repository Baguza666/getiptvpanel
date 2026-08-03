import { expect, test } from 'vitest';
import { GET } from '../src/pages/sitemap.xml';
import { indexableRoutes, site } from '../src/config/site';

test('sitemap contains every canonical indexable route and excludes gated/removed routes', async () => {
  const response = GET({} as never) as Response;
  const xml = await response.text();
  for (const route of indexableRoutes) expect(xml).toContain(new URL(route, site.url).toString());
  expect(xml).not.toContain('/iptv-trial');
  expect(xml).not.toContain('/eviter-coupures-iptv');
  expect(xml).not.toContain('/individual-subscription');
  expect(xml).not.toContain('/is-iptv-legal-in-the-uk');
  expect(response.headers.get('content-type')).toContain('application/xml');
});
