import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Aqui o contraste de cor e o tamanho dos alvos SÃO verificados (navegador real),
 * o que o jsdom não consegue. Rode também com leitor de tela (NVDA/VoiceOver) antes de publicar.
 */
const paginas = ['/boas-vindas', '/sobre', '/home', '/check-in', '/formulario/exaustao', '/resultados', '/calendario', '/calendario/insights', '/perfis', '/perfis/overload-recovery', '/doencas', '/doencas/burnout', '/chat', '/resultados/assistencia-proxima'];

for (const rota of paginas) {
  test(`sem violações WCAG 2.2 AA: ${rota}`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('bm:consentAt', JSON.stringify(new Date().toISOString())));
    await page.goto(rota);
    await page.waitForLoadState('networkidle');
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
  });
}

test('navegação só por teclado: o link "Pular para o conteúdo" é o primeiro foco', async ({ page }) => {
  await page.goto('/home');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
});

test('zoom de 200%: sem rolagem horizontal na Home', async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 800 }); // equivale a 1440px a 200%
  await page.goto('/home');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
