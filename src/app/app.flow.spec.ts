import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';
import { ConsentService } from './core/services/consent.service';
import { CHAT_REPLY_DELAY_MS } from './features/chat/services/chat.service';

/**
 * Integração do app inteiro (rotas reais, guard, shell, serviços reais com localStorage).
 * Faz o papel de um E2E leve: não substitui Playwright em navegador real (ver playwright/ e SETUP-ETAPA-6.md).
 */
describe('Fluxos do app (rotas reais)', () => {
  // Partida a frio: o Vite compila cada página lazy no primeiro acesso e passa dos 5 s padrão.
  vi.setConfig({ testTimeout: 30_000 });

  async function boot() {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [...appConfig.providers, { provide: CHAT_REPLY_DELAY_MS, useValue: 0 }],
    });
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);
    const el = fixture.nativeElement as HTMLElement;
    const refresh = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    };
    const go = async (url: string) => {
      await router.navigateByUrl(url);
      await refresh();
    };
    const waitUrl = async (url: string) => {
      await vi.waitFor(() => expect(router.url).toBe(url));
      await refresh();
    };
    const submit = async () => {
      el.querySelector('main form')!.dispatchEvent(new Event('submit', { cancelable: true }));
      await refresh();
    };
    const pick = (i: number) => (el.querySelectorAll('main input[type=radio]')[i] as HTMLInputElement).click();
    const active = () => el.querySelector('.bm-header__nav-link--active')?.textContent?.trim();
    return { fixture, router, el, go, waitUrl, submit, pick, active };
  }

  it('primeiro acesso → consentimento → 3 perguntas → resultado (atenção moderada)', async () => {
    const { el, router, go, waitUrl, submit, pick, active } = await boot();
    await go('/');
    expect(router.url).toBe('/boas-vindas');
    expect(active()).toBe('Home');

    await submit(); // sem consentir
    expect(el.querySelector('main [role=alert]')?.textContent).toContain('Marque a caixa');
    expect(router.url).toBe('/boas-vindas');

    (el.querySelector('main input[type=checkbox]') as HTMLInputElement).click();
    await submit();
    await waitUrl('/formulario/exaustao');

    pick(2); await submit(); await waitUrl('/formulario/recuperacao'); // em vários dias
    pick(1); await submit(); await waitUrl('/formulario/rotina');      // em poucos dias
    pick(1); await submit(); await waitUrl('/resultados');             // afetou um pouco

    expect(el.textContent).toContain('Atenção moderada');
    expect(el.textContent).toContain('Sobrecarga e recuperação');
    expect(active()).toBe('Resultados');
    expect(TestBed.inject(ConsentService).hasConsent()).toBe(true);
  });

  it('o guard impede o questionário sem consentimento', async () => {
    const { router, go } = await boot();
    await go('/formulario/rotina');
    expect(router.url).toBe('/boas-vindas');
  });

  it('com consentimento, a raiz leva à Home e o menu marca Home', async () => {
    const { router, go, active } = await boot();
    TestBed.inject(ConsentService).give();
    await go('/');
    expect(router.url).toBe('/home');
    expect(active()).toBe('Home');
  });

  it('check-in salva e abre o calendário com o registro de hoje; Home mostra os chips', async () => {
    const { el, router, go, waitUrl, submit, pick } = await boot();
    TestBed.inject(ConsentService).give();
    await go('/check-in');
    pick(1); // cansado
    pick(4); // energia baixa (4 humores + 1º de energia)
    await submit();
    await waitUrl('/calendario');
    expect(el.querySelectorAll('main bm-day-marker').length).toBe(1);

    await go('/home');
    expect(router.url).toBe('/home');
    expect(el.textContent).toContain('Humor: cansado');
    expect(el.textContent).toContain('Energia: baixa');
  });

  it('modal de perfil é rota filha: abre por link direto e volta para a lista', async () => {
    const { el, router, go, waitUrl } = await boot();
    await go('/perfis/room-to-recover');
    await vi.waitFor(() => expect(el.querySelector('dialog')).toBeTruthy());
    expect(el.querySelector('#profile-title')?.textContent).toContain('Espaço para recuperar');
    (el.querySelector('dialog .btn-outline-secondary') as HTMLButtonElement).click();
    await waitUrl('/perfis');
    expect(el.querySelector('dialog')).toBeNull();
    expect(router.url).toBe('/perfis');
  });

  it('modal de tema: só o Burnout abre; um tema sem conteúdo volta à lista', async () => {
    const { el, router, go } = await boot();
    await go('/doencas/burnout');
    await vi.waitFor(() => expect(el.querySelector('#topic-title')?.textContent).toContain('Entendendo o burnout'));
    await go('/doencas/anxiety');
    await vi.waitFor(() => expect(router.url).toBe('/doencas'));
  });

  it('assistência próxima é uma rota própria e mantém Resultados ativo no menu', async () => {
    const { el, router, go, active } = await boot();
    await go('/resultados/assistencia-proxima');
    expect(router.url).toBe('/resultados/assistencia-proxima');
    expect(el.querySelector('h1')?.textContent).toContain('Apoio também é cuidado');
    expect(active()).toBe('Resultados');
  });

  it('chat: sugestão responde e o menu marca Chat', async () => {
    const { fixture, el, go, active } = await boot();
    await go('/chat');
    expect(active()).toBe('Chat');
    (el.querySelectorAll('main bm-suggestion-chip button')[0] as HTMLButtonElement).click();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(el.querySelectorAll('bm-chat-bubble').length).toBe(3);
    });
  });

  it('rota desconhecida cai na Home', async () => {
    const { router, go } = await boot();
    await go('/nao-existe');
    expect(router.url).toBe('/home');
  });
});
