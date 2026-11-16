import { defineConfig, devices } from '@playwright/test';

/**
 * [NÃO EXECUTADO NO SANDBOX] O ambiente em que este código foi gerado não consegue baixar navegadores.
 * Rode na sua máquina:  npm i -D @playwright/test @axe-core/playwright && npx playwright install
 *                        npx playwright test
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://localhost:4200', trace: 'on-first-retry', locale: 'pt-BR' },
  webServer: { command: 'npx ng serve --port 4200', url: 'http://localhost:4200', reuseExistingServer: true, timeout: 120_000 },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
});
