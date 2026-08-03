import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const publicRoutes = [
  '/', '/about', '/acceptable-use', '/become-a-reseller', '/contact', '/guides',
  '/guides/fire-tv-setup', '/guides/iptv-smarters-setup', '/guides/tivimate-setup',
  '/how-to-choose-an-iptv-service', '/individual-subscription', '/is-iptv-legal-in-the-uk',
  '/privacy-policy', '/profit-calculator', '/refund-policy', '/reseller-packages',
  '/reseller-panel', '/support', '/terms',
] as const;

const targetViewports = [
  { width: 360, height: 800, label: 'small-mobile' },
  { width: 375, height: 812, label: 'mobile' },
  { width: 390, height: 844, label: 'large-mobile' },
  { width: 812, height: 375, label: 'phone-landscape' },
  { width: 768, height: 1024, label: 'tablet-portrait' },
  { width: 1024, height: 768, label: 'tablet-landscape' },
  { width: 1440, height: 900, label: 'desktop' },
  { width: 1680, height: 1050, label: 'wide-desktop' },
] as const;

test('homepage is B2B-first and passes automated accessibility scan', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('IPTV Reseller Panel for UK Reseller Businesses');
  await expect(page.getByRole('link', { name: 'Compare reseller packages' }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Estimate the numbers before buying credits' })).toBeVisible();
  await expect(page.locator('.site-header')).not.toContainText('UK reseller operations');
  await expect(page.getByText('LIVE PROFIT ESTIMATE')).toHaveCSS('color', 'rgb(73, 99, 7)');
  await page.getByLabel('Selling price per customer (£)').fill('70');
  await expect(page.getByText('£580', { exact: true })).toBeVisible();
  await expect(page.locator('[aria-labelledby="package-preview-title"] .rate-card')).toHaveCount(3);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('owner-supplied package prices, service scope and calculator render the commercial state', async ({ page }) => {
  await page.goto('/reseller-packages');
  await expect(page.getByRole('heading', { name: 'Compare the seven panel options' })).toBeVisible();
  await expect(page.locator('.rate-card')).toHaveCount(3);
  await expect(page.locator('.server-name-item')).toHaveCount(7);
  await expect(page.getByText('Lion OTT', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '£12 per credit' })).toBeVisible();
  await expect(page.getByText('£240', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/The published pricing rules/)).toBeVisible();
  await expect(page.getByText(/No separate panel or setup fee is added/).first()).toBeVisible();
  await page.goto('/individual-subscription');
  await expect(page.getByRole('heading', { name: 'Looking for One IPTV Subscription?' })).toBeVisible();
  await page.goto('/profit-calculator');
  await expect(page.getByText(/Operating contribution:/).first()).toBeVisible();
  await page.getByLabel('Customers sold').fill('10');
  await page.getByRole('button', { name: 'Complete estimate' }).click();
  await expect(page.getByText('Estimate updated from the assumptions above.')).toBeVisible();
});

test('reseller application validates fields and prepares a WhatsApp message', async ({ page }) => {
  await page.goto('/become-a-reseller#application');
  await page.getByRole('button', { name: 'Prepare application summary' }).click();
  await expect(page.getByLabel('Name')).toBeFocused();
  await page.getByLabel('Name').fill('Test Applicant');
  await page.getByLabel('WhatsApp number').fill('+44 7700 900000');
  await page.getByLabel('Panel of interest').selectOption('Lion OTT');
  await page.getByLabel('Current experience').selectOption('New to reselling');
  await page.getByLabel('Expected customers in the first 90 days').selectOption('1–10');
  await page.getByLabel('Initial budget band').selectOption('Under £250');
  await page.getByLabel(/I understand this website will prepare/).check();

  await expect(page.getByRole('status')).toContainText('Nothing is submitted to this website');
  await page.getByRole('button', { name: 'Prepare application summary' }).click();
  await expect(page.getByRole('status')).toContainText('Summary ready');
  await expect(page.getByLabel('Prepared message')).toHaveValue(/Panel: Lion OTT/);
  await expect(page.getByLabel('Prepared message')).toHaveValue(/Name: Test Applicant/);
  const whatsappLink = page.getByRole('link', { name: 'Open WhatsApp' });
  await expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/33644651365');
  expect(await whatsappLink.getAttribute('href')).not.toContain('?');
});

test('mobile navigation opens and every control remains usable', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const button = page.locator('#mobile-menu-button');
  await expect(button).toHaveAccessibleName('Open navigation');
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(button).toHaveAccessibleName('Close navigation');
  const mobileNavigation = page.getByRole('navigation', { name: 'Mobile navigation' });
  const firstLink = mobileNavigation.getByRole('link', { name: 'Reseller Panel' });
  await expect(firstLink).toBeVisible();
  await expect(firstLink).toBeFocused();
  await expect(page.locator('#main-content')).toHaveAttribute('inert', '');
  await page.keyboard.press('Shift+Tab');
  await expect(button).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(mobileNavigation.getByRole('link', { name: 'Request Pricing' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button).toBeFocused();
  await expect(page.locator('#main-content')).not.toHaveAttribute('inert', '');

  await button.click();
  await page.setViewportSize({ width: 1200, height: 800 });
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('body')).not.toHaveClass(/menu-open/);
  await expect(page.locator('#main-content')).not.toHaveAttribute('inert', '');

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/reseller-panel');
  await page.locator('#mobile-menu-button').click();
  const currentMobileLink = page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Reseller Panel' });
  await expect(currentMobileLink).toHaveAttribute('aria-current', 'page');
  expect(await currentMobileLink.evaluate((element) => parseFloat(getComputedStyle(element).borderLeftWidth))).toBeGreaterThanOrEqual(3);
});

for (const viewport of targetViewports) {
  test(`every public route is stable without overflow at ${viewport.label}`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') runtimeErrors.push(`${page.url()}: ${message.text()}`);
    });
    page.on('pageerror', (error) => runtimeErrors.push(`${page.url()}: ${error.message}`));
    await page.setViewportSize(viewport);
    for (const route of publicRoutes) {
      const response = await page.goto(route);
      expect(response?.status(), `${route} should load`).toBe(200);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${route} should not overflow at ${viewport.label}`).toBe(true);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    }
    expect(runtimeErrors).toEqual([]);
  });
}

test('every public route passes the narrow-screen accessibility scan', async ({ page }) => {
  for (const route of publicRoutes) {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(await page.locator('body').innerText()).not.toMatch(/unknown from provided code|to be confirmed|not configured|would render here|still required|\bpending\b|not applicable|held behind verification/i);
    const narrowResults = await new AxeBuilder({ page }).analyze();
    expect(narrowResults.violations, `${route} should pass axe at 375px`).toEqual([]);
  }
});

test('text resizing, touch targets, focus and restrained motion remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of publicRoutes) {
    await page.goto(route);
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${route} should tolerate 200% text`).toBe(true);
  }

  await page.goto('/');
  const declineAnalytics = page.getByRole('button', { name: 'Decline' });
  await expect(declineAnalytics).toBeVisible();
  await expect(declineAnalytics).toHaveCSS('color', 'rgb(255, 253, 247)');
  await declineAnalytics.click();
  const compactControls = await page.locator('.button, .menu-button, .hero-bridge-link, .faq-list summary, .field input, .field select').evaluateAll((elements) =>
    elements.filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
    }).map((element) => `${element.tagName}.${element.className}`),
  );
  expect(compactControls).toEqual([]);
  expect(await page.getByLabel('Selling price per customer (£)').evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16);

  const primary = page.locator('.page-hero .hero-actions').getByRole('link', { name: 'Compare reseller packages' });
  const beforeHover = await primary.boundingBox();
  await primary.hover();
  expect(await primary.boundingBox()).toEqual(beforeHover);
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skipLink).toBeFocused();
  expect(await skipLink.evaluate((element) => parseFloat(getComputedStyle(element).outlineWidth))).toBeGreaterThanOrEqual(3);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  expect(await primary.evaluate((element) => parseFloat(getComputedStyle(element).transitionDuration))).toBeLessThanOrEqual(0.001);
});

test('calculator states and package names remain legible', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByLabel('Selling price per customer (£)').fill('5');
  const heroProfit = page.locator('[data-hero-profit]');
  await expect(heroProfit).toHaveAttribute('data-negative', 'true');
  await expect(heroProfit).toContainText('-£70');

  for (const viewport of [{ width: 375, height: 812 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/reseller-packages');
    await expect(page.locator('.server-name-item')).toHaveCount(7);
    expect(await page.locator('.server-name-list').evaluateAll((elements) => elements.every((element) => element.scrollWidth <= element.clientWidth))).toBe(true);
  }
});

test('legacy redirect, 410 and 404 behaviour are explicit', async ({ page, request }) => {
  const redirects = {
    '/installer-tivimate-premium': '/guides/tivimate-setup',
    '/configurer-iptv-smarters-pro': '/guides/iptv-smarters-setup',
    '/guide-panel-revendeur': '/reseller-panel',
    '/rentabilite-revendeur-iptv': '/profit-calculator',
    '/devenir-revendeur': '/become-a-reseller',
    '/meilleur-panel-revendeur-iptv': '/reseller-panel',
    '/ressources': '/guides',
    '/tutoriels': '/guides',
  } as const;
  for (const [source, destination] of Object.entries(redirects)) {
    const response = await request.get(source, { maxRedirects: 0 });
    expect(response.status(), source).toBe(308);
    expect(response.headers().location, source).toBe(destination);
    const final = await request.get(source);
    expect(final.status(), source).toBe(200);
    expect(final.url(), source).toContain(destination);
  }

  const removals = [
    '/eviter-coupures-iptv', '/quel-operateur-bloque-iptv', '/revendeur-iptv-suisse',
    '/legalite-revente-iptv-france', '/meilleur-fournisseur-iptv',
    '/comment-trouver-clients-iptv', '/infrastructure-serveur', '/cgv',
    '/conditions-generales', '/mentions-legales', '/politique-de-confidentialite',
  ];
  for (const route of removals) {
    const gone = await request.get(route, { maxRedirects: 0 });
    expect(gone.status(), route).toBe(410);
  }

  const response = await page.goto('/route-that-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('That page is not available');
});

test('disabled and unreviewed routes are noindex and excluded from the sitemap', async ({ page, request }) => {
  for (const route of ['/individual-subscription', '/is-iptv-legal-in-the-uk']) {
    await page.goto(route);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
  }
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).not.toContain('/individual-subscription');
  expect(sitemap).not.toContain('/is-iptv-legal-in-the-uk');
});

test('consented analytics dispatches allowlisted non-PII events once', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('analytics_consent', 'granted'));
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.goto('/reseller-packages?utm_source=qa-test&utm_campaign=prelaunch');

  const events = await page.evaluate(() => window.dataLayer
    .filter((entry) => Object.values(entry as object)[0] === 'event')
    .map((entry) => Array.from(entry as ArrayLike<unknown>)));
  expect(events.filter((entry) => entry[1] === 'page_view')).toHaveLength(1);
  expect(events.filter((entry) => entry[1] === 'reseller_packages_view')).toHaveLength(1);
  const serialised = JSON.stringify(events);
  expect(serialised).toContain('qa-test');
  expect(serialised).not.toMatch(/name|email|phone|message|credentials|playlist|payment/i);
});
