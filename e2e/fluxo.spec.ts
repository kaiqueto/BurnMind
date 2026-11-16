import { expect, test } from '@playwright/test';

test.describe('Fluxo principal', () => {
  test('primeiro acesso → consentimento → 3 perguntas → resultado', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/boas-vindas$/);

    await page.getByRole('button', { name: /Começar/ }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'Marque a caixa' })).toBeVisible();

    await page.getByRole('checkbox', { name: /Entendo os limites/ }).check();
    await page.getByRole('button', { name: /Começar/ }).click();
    await expect(page).toHaveURL(/\/formulario\/exaustao$/);

    await page.getByRole('radio', { name: 'Em vários dias' }).check();
    await page.getByRole('button', { name: /Continuar/ }).click();
    await page.getByRole('radio', { name: 'Em poucos dias' }).check();
    await page.getByRole('button', { name: /Continuar/ }).click();
    await page.getByRole('radio', { name: 'Afetou um pouco' }).check();
    await page.getByRole('button', { name: /Ver resultado/ }).click();

    await expect(page).toHaveURL(/\/resultados$/);
    await expect(page.getByText('Atenção moderada').first()).toBeVisible();
    await expect(page.getByText('Sobrecarga e recuperação').first()).toBeVisible();
  });

  test('exportar PDF baixa o arquivo', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('bm:consentAt', JSON.stringify(new Date().toISOString())));
    await page.goto('/formulario/exaustao');
    for (const [answer, button] of [['Em vários dias', /Continuar/], ['Em poucos dias', /Continuar/], ['Afetou um pouco', /Ver resultado/]] as const) {
      await page.getByRole('radio', { name: answer }).check();
      await page.getByRole('button', { name: button }).click();
    }
    await page.getByRole('button', { name: /Exportar resultado/ }).click();
    const dialog = page.getByRole('dialog', { name: 'Preparar resumo em PDF' });
    await expect(dialog).toBeVisible();
    const [download] = await Promise.all([page.waitForEvent('download'), dialog.getByRole('button', { name: 'Preparar PDF' }).click()]);
    expect(download.suggestedFilename()).toMatch(/^burnoutmind-resumo-\d{4}-\d{2}-\d{2}\.pdf$/);
  });

  test('modal fecha com Esc e devolve o foco', async ({ page }) => {
    await page.goto('/perfis');
    const link = page.getByRole('link', { name: /Ver detalhes: Sobrecarga/ });
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page).toHaveURL(/\/perfis$/);
  });

  test('chat: pedido de ajuda mostra CVV e SAMU', async ({ page }) => {
    await page.goto('/chat');
    await page.getByLabel('Escreva sua mensagem').fill('não aguento mais viver');
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();
    await expect(page.getByText(/CVV pelo telefone 188/)).toBeVisible();
    await expect(page.getByText(/SAMU \(192\)/)).toBeVisible();
  });
});
