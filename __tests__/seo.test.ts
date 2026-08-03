import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import IndexPage from '../src/pages/index.astro';
import LegalPage from '../src/pages/is-iptv-legal-in-the-uk.astro';

const extractJsonLd = (html: string) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .flatMap((match) => {
    const value = JSON.parse(match[1]);
    return value['@graph'] ?? [value];
  });

test('homepage has UK metadata, a self-canonical and safe global schema', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(IndexPage);
  expect(html).toContain('<html lang="en-GB"');
  expect(html).toContain('<title>IPTV Reseller UK | Reseller Panel &amp; Credit Packages</title>');
  expect(html).toContain('<link rel="canonical" href="https://getiptvpanel.com/">');
  expect((html.match(/<h1[ >]/g) || [])).toHaveLength(1);

  const schema = extractJsonLd(html);
  expect(schema.some((item) => item['@type'] === 'Organization')).toBe(true);
  expect(schema.some((item) => item['@type'] === 'WebSite')).toBe(true);
  expect(schema.some((item) => ['Product', 'Offer', 'Review', 'AggregateRating'].includes(item['@type']))).toBe(false);
});

test('legal page stays noindex without schema until qualified review is recorded', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(LegalPage);
  const schema = extractJsonLd(html);
  expect(schema).toEqual([]);
  expect(html).toContain('<meta name="robots" content="noindex, follow">');
  expect(html).toContain('General information—not legal advice');
  expect(html).toContain('Independent legal review is not recorded.');
});
