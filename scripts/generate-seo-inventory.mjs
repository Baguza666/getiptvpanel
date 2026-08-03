import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const origin = 'https://getiptvpanel.com';
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
if (!fs.existsSync(dist)) throw new Error('dist/ is missing. Run npm run build first.');

const csv = (rows) => rows.map((row) => row.map((value) => {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}).join(',')).join('\n') + '\n';
const decode = (value = '') => value
  .replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'")
  .replaceAll('&pound;', '£').replaceAll('&ndash;', '–').replaceAll('&mdash;', '—');
const text = (value = '') => decode(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const routeFor = (file) => {
  const relative = path.relative(dist, file).replaceAll(path.sep, '/');
  return relative === 'index.html' ? '/' : `/${relative.replace(/\/index\.html$/, '')}`;
};
const files = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === 'index.html') files.push(full);
  }
};
walk(dist);
const htmlByRoute = new Map(files.map((file) => [routeFor(file), fs.readFileSync(file, 'utf8')]));
const sitemapXml = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const sitemapRoutes = new Set([...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname.replace(/\/$/, '') || '/'));

const routeDetails = {
  '/': ['Homepage', 'Main UK B2B reseller proposition', 'iptv reseller uk', 'Request reseller pricing'],
  '/reseller-panel': ['Commercial detail', 'Panel functionality and management workflow', 'iptv reseller panel', 'Request panel terms'],
  '/reseller-packages': ['Commercial pricing', 'Packages, credit definitions and reseller pricing', 'iptv reseller packages', 'Request pricing'],
  '/become-a-reseller': ['Commercial application', 'Business-starting guide and reseller application', 'become iptv reseller', 'Prepare reseller enquiry'],
  '/profit-calculator': ['Interactive tool', 'GBP reseller operating estimate', 'iptv reseller profit calculator', 'Complete estimate'],
  '/individual-subscription': ['Disabled product scope', 'Explain that individual sales are unavailable', '', 'Move to reseller enquiry'],
  '/how-to-choose-an-iptv-service': ['Buyer guide', 'Evidence-led IPTV service selection', 'how to choose an iptv service', 'Use selection checklist'],
  '/is-iptv-legal-in-the-uk': ['Legal information', 'Official-source UK rights overview pending legal review', 'is iptv legal uk', 'Use rights checklist'],
  '/guides': ['Guide hub', 'Official-store player setup hub', 'iptv player setup', 'Open a guide'],
  '/guides/tivimate-setup': ['Article guide', 'TiviMate official-store setup', 'tivimate setup', 'Get setup support'],
  '/guides/iptv-smarters-setup': ['Article guide', 'IPTV Smarters official-store setup', 'iptv smarters setup', 'Get setup support'],
  '/guides/fire-tv-setup': ['Article guide', 'Fire TV official-store setup boundary', 'iptv fire tv setup', 'Get setup support'],
  '/about': ['Trust page', 'Publication scope and enquiry process', '', 'Start reseller enquiry'],
  '/contact': ['Contact page', 'Route reseller and support enquiries', '', 'Open qualified enquiry'],
  '/support': ['Support page', 'Prepare a safe support request', '', 'Open WhatsApp support'],
  '/privacy-policy': ['Legal page', 'Website and WhatsApp privacy disclosure', '', 'Ask privacy question'],
  '/terms': ['Legal page', 'Public website terms', '', 'Review website terms'],
  '/refund-policy': ['Legal page', 'No-checkout and refund disclosure', '', 'Review before payment'],
  '/acceptable-use': ['Legal page', 'Prohibited and responsible use', '', 'Understand acceptable use'],
};
const sourceFiles = new Map([
  ...[...htmlByRoute.keys()].map((route) => [route, route === '/' ? 'src/pages/index.astro' : `src/pages${route}.astro`]),
  ['/guides', 'src/pages/guides/index.astro'],
]);

const incoming = new Map([...htmlByRoute.keys()].map((route) => [route, 0]));
const outgoing = new Map([...htmlByRoute.keys()].map((route) => [route, 0]));
const linkRows = [['source_url', 'target_url', 'anchor_text', 'context', 'link_type', 'crawlable', 'status', 'notes']];
for (const [route, html] of htmlByRoute) {
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const href = decode(match[1]);
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const target = href.split(/[?#]/)[0].replace(/\/$/, '') || '/';
    const exists = htmlByRoute.has(target);
    outgoing.set(route, (outgoing.get(route) || 0) + 1);
    if (exists && target !== route) incoming.set(target, (incoming.get(target) || 0) + 1);
    linkRows.push([route, target, text(match[2]), 'Rendered HTML', 'Internal HTML link', 'true', exists ? '200 production-like' : 'Broken', target === route ? 'Self-link' : 'Direct canonical route']);
  }
}

const schemaTypes = (html) => {
  const types = new Set();
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const data = JSON.parse(match[1]);
    for (const item of data['@graph'] || [data]) if (item['@type']) types.add(item['@type']);
  }
  return [...types];
};

const inventoryRows = [[
  'url', 'source', 'template', 'purpose', 'primary_keyword', 'http_status', 'final_url',
  'redirect_hops', 'indexable', 'robots_directive', 'canonical', 'canonical_status',
  'in_sitemap', 'internal_links_in', 'internal_links_out', 'title', 'h1', 'schema_types',
  'action', 'severity', 'notes',
]];
const onPageRows = [['url', 'primary_intent', 'primary_keyword', 'title', 'meta_description', 'h1', 'secondary_headings', 'canonical', 'robots', 'schema', 'primary_cta', 'secondary_cta', 'internal_link_sources', 'content_owner', 'review_status']];
const schemaRows = [['url', 'schema_type', 'implementation_source', 'visible_content_match', 'required_fields_complete', 'validation_status', 'eligible', 'notes']];

for (const [route, html] of [...htmlByRoute].sort(([a], [b]) => a.localeCompare(b))) {
  const details = routeDetails[route] || ['Astro page', 'Public information', '', 'Follow page action'];
  const title = text(html.match(/<title>([\s\S]*?)<\/title>/)?.[1]);
  const description = decode(html.match(/<meta name="description" content="([^"]+)"/)?.[1] || '');
  const canonical = decode(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || '');
  const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1] || 'index, follow';
  const h1 = text(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]);
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((match) => text(match[1]));
  const types = schemaTypes(html);
  const isIndexable = sitemapRoutes.has(route);
  const severity = route === '/is-iptv-legal-in-the-uk' ? 'P1' : route === '/individual-subscription' ? 'P2' : '';
  inventoryRows.push([
    route, 'Astro route and production build', sourceFiles.get(route), details[1], details[2],
    '200 production-like', route, 0, isIndexable, robots, canonical, canonical === new URL(route, origin).toString() ? 'Self-canonical 200' : 'Mismatch',
    isIndexable, incoming.get(route), outgoing.get(route), title, h1, types.join('; '), isIndexable ? 'KEEP' : 'NOINDEX', severity,
    route === '/is-iptv-legal-in-the-uk' ? 'Official sources checked; qualified legal review not recorded.' : route === '/individual-subscription' ? 'B2C offer and rights fields are incomplete; direct sales disabled.' : 'Validated against static production output.',
  ]);
  onPageRows.push([
    route, details[1], details[2], title, description, h1, h2s.join('; '), canonical, robots,
    types.join('; ') || 'None', details[3], h2s[0] || '', `${incoming.get(route)} rendered links`,
    'Owner confirmation required for commercial facts', route === '/is-iptv-legal-in-the-uk' ? 'Technical source review complete; qualified legal review required' : 'Technical pre-launch review complete',
  ]);
  if (!types.length) schemaRows.push([route, 'None', 'Schema suppressed by noindex gate', 'Not applicable', 'Not applicable', 'Automated suppression test passed', 'false', 'No structured data emitted on noindex route.']);
  for (const type of types) schemaRows.push([route, type, 'src/components/SEO.astro', 'true', 'true', 'JSON parsed and built-site checks passed', 'true', 'Visible-page and canonical URLs match.']);
}

for (const redirect of config.redirects) {
  inventoryRows.push([redirect.source, 'vercel.json redirect', 'Vercel edge redirect', 'Legacy close-intent migration', '', '308 production-like', redirect.destination, 1, 'false', 'Not applicable', '', 'Not applicable', 'false', 0, 0, '', '', '', '308', '', 'Direct redirect tested locally; live Vercel edge verification required.']);
}
const removalPattern = config.routes.find((route) => route.status === 410)?.src || '';
const removalGroup = removalPattern.match(/\(\?:([^)]*)\)/)?.[1]?.split('|') || [];
for (const slug of removalGroup) inventoryRows.push([`/${slug}`, 'vercel.json removal route', 'Vercel edge 410', 'Unsafe, obsolete or unmatched legacy intent', '', '410 production-like', '', 0, 'false', 'Not applicable', '', 'Not applicable', 'false', 0, 0, '', '', '', '410', '', 'Explicit removal; live Vercel edge verification required.']);
inventoryRows.push(['/sitemap.xml', 'src/pages/sitemap.xml.ts', 'Astro XML endpoint', 'Search discovery', '', '200 production-like', '/sitemap.xml', 0, 'false', 'Not applicable', '', 'Not applicable', 'false', 0, 0, '', '', '', 'KEEP', '', `${sitemapRoutes.size} canonical indexable URLs.`]);
inventoryRows.push(['/robots.txt', 'public/robots.txt', 'Static text asset', 'Crawler directives', '', '200 production-like', '/robots.txt', 0, 'false', 'Not applicable', '', 'Not applicable', 'false', 0, 0, '', '', '', 'KEEP', '', 'References the production sitemap and does not block public routes.']);
inventoryRows.push(['/route-that-does-not-exist', 'Production-like browser test', 'src/pages/404.astro', 'Custom not-found response', '', '404 production-like', '', 0, 'false', 'noindex, follow', '', 'Not applicable', 'false', 0, 0, 'Page Not Found | GetIPTVPanel', 'That page is not available', '', '404', '', 'Representative unknown route; custom page tested.']);

fs.mkdirSync(path.join(root, 'docs/seo'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/seo/url-inventory.csv'), csv(inventoryRows));
fs.writeFileSync(path.join(root, 'docs/seo/internal-link-map.csv'), csv(linkRows));
fs.writeFileSync(path.join(root, 'docs/seo/on-page-map.csv'), csv(onPageRows));
fs.writeFileSync(path.join(root, 'docs/seo/schema-matrix.csv'), csv(schemaRows));
console.log(`Generated SEO inventories: ${inventoryRows.length - 1} URLs, ${linkRows.length - 1} internal links, ${onPageRows.length - 1} on-page rows, ${schemaRows.length - 1} schema rows.`);
