import fs from 'node:fs';
import { expect, test } from 'vitest';

test('migration rules are direct, explicit and never blanket redirect to home', () => {
  const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  expect(config.trailingSlash).toBe(false);
  expect(config.redirects).toHaveLength(8);
  const sources = new Set(config.redirects.map((item: { source: string }) => item.source));
  for (const redirect of config.redirects) {
    expect(redirect.permanent).toBe(true);
    expect(redirect.destination).not.toBe('/');
    expect(sources.has(redirect.destination)).toBe(false);
  }
  expect(config.routes).toHaveLength(1);
  expect(config.routes[0].status).toBe(410);
  expect(config.routes[0].src).toContain('revendeur-iptv-suisse');
  expect(config.routes[0].src).toContain('legalite-revente-iptv-france');
  expect(config.routes[0].src).toContain('eviter-coupures-iptv');
});
