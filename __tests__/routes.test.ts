import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import ContactPage from '../src/pages/contact.astro';
import MentionsPage from '../src/pages/mentions-legales.astro';
import PolitiquePage from '../src/pages/politique-de-confidentialite.astro';
import ConditionsPage from '../src/pages/conditions-generales.astro';

test('Secondary Routes render properly without throwing', async () => {
    const container = await AstroContainer.create();
    
    // Test Contact Routing
    const contactHtml = await container.renderToString(ContactPage);
    expect(contactHtml).toContain('Contactez-nous');
    expect(contactHtml).toContain('Envoyer le message');
    expect(contactHtml).toContain('/api/submit');
    
    // Test Legal Pages Routing
    const mentionsHtml = await container.renderToString(MentionsPage);
    expect(mentionsHtml).toContain('Mentions Légales');
    expect(mentionsHtml).toContain('Lorem ipsum');

    const politiqueHtml = await container.renderToString(PolitiquePage);
    expect(politiqueHtml).toContain('Politique de Confidentialité');
    expect(politiqueHtml).toContain('Lorem ipsum');

    const conditionsHtml = await container.renderToString(ConditionsPage);
    expect(conditionsHtml).toContain('Conditions Générales');
    expect(conditionsHtml).toContain('Lorem ipsum');
});
