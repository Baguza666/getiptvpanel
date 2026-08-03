const rawBase = process.env.PUBLIC_SMOKE_BASE_URL;
if (!rawBase) throw new Error('Set PUBLIC_SMOKE_BASE_URL to the approved HTTPS production origin.');
const base = new URL(rawBase);
if (base.protocol !== 'https:' || base.pathname !== '/' || base.search || base.hash) throw new Error('PUBLIC_SMOKE_BASE_URL must be an HTTPS origin.');

const coreRoutes = ['/', '/reseller-panel', '/reseller-packages', '/become-a-reseller', '/profit-calculator', '/guides', '/contact'];
const noindexRoutes = ['/individual-subscription', '/is-iptv-legal-in-the-uk'];
const redirects = {
  '/installer-tivimate-premium': '/guides/tivimate-setup',
  '/configurer-iptv-smarters-pro': '/guides/iptv-smarters-setup',
  '/guide-panel-revendeur': '/reseller-panel',
  '/rentabilite-revendeur-iptv': '/profit-calculator',
  '/devenir-revendeur': '/become-a-reseller',
  '/meilleur-panel-revendeur-iptv': '/reseller-panel',
  '/ressources': '/guides',
  '/tutoriels': '/guides',
};
const removals = [
  '/eviter-coupures-iptv', '/quel-operateur-bloque-iptv', '/revendeur-iptv-suisse',
  '/legalite-revente-iptv-france', '/meilleur-fournisseur-iptv', '/comment-trouver-clients-iptv',
  '/infrastructure-serveur', '/cgv', '/conditions-generales', '/mentions-legales',
  '/politique-de-confidentialite',
];
const errors = [];

for (const route of coreRoutes) {
  const response = await fetch(new URL(route, base), { redirect: 'manual' });
  const html = await response.text();
  if (response.status !== 200) errors.push(`${route}: expected 200, received ${response.status}`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical !== new URL(route, base).toString()) errors.push(`${route}: incorrect canonical ${canonical}`);
  if (/noindex/i.test(html.match(/<meta name="robots" content="([^"]+)"/)?.[1] || '')) errors.push(`${route}: unexpected noindex`);
}
for (const route of noindexRoutes) {
  const response = await fetch(new URL(route, base));
  const html = await response.text();
  if (response.status !== 200 || !/<meta name="robots" content="noindex, follow"/.test(html)) errors.push(`${route}: expected a 200 noindex response`);
}
for (const [source, destination] of Object.entries(redirects)) {
  const response = await fetch(new URL(source, base), { redirect: 'manual' });
  if (![301, 308].includes(response.status)) errors.push(`${source}: expected permanent redirect, received ${response.status}`);
  if (response.headers.get('location') !== destination && response.headers.get('location') !== new URL(destination, base).toString()) errors.push(`${source}: incorrect destination ${response.headers.get('location')}`);
}
for (const route of removals) {
  const response = await fetch(new URL(route, base), { redirect: 'manual' });
  if (response.status !== 410) errors.push(`${route}: expected 410, received ${response.status}`);
}

const robots = await fetch(new URL('/robots.txt', base));
const robotsText = await robots.text();
if (robots.status !== 200 || !robotsText.includes(`Sitemap: ${base.origin}/sitemap.xml`) || /Disallow:\s*\/\s*$/m.test(robotsText)) errors.push('/robots.txt: invalid production response');
const sitemap = await fetch(new URL('/sitemap.xml', base));
const sitemapText = await sitemap.text();
if (sitemap.status !== 200 || sitemapText.includes('/individual-subscription') || sitemapText.includes('/is-iptv-legal-in-the-uk')) errors.push('/sitemap.xml: invalid production response');
const missing = await fetch(new URL('/prelaunch-smoke-route-that-does-not-exist', base), { redirect: 'manual' });
if (missing.status !== 404) errors.push(`custom 404: expected 404, received ${missing.status}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Production smoke checks passed for ${base.origin}; no form or payment was submitted.`);
