import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NearbyCarePageComponent } from './nearby-care-page.component';

describe('NearbyCarePageComponent', () => {
  async function setup() {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [NearbyCarePageComponent], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(NearbyCarePageComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }
  const links = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLAnchorElement>('a[target=_blank]'));

  it('mostra UBS e CAPS, o aviso legal e o bloco de risco imediato com SAMU e CVV', async () => {
    const { el } = await setup();
    expect(el.querySelectorAll('bm-service-card').length).toBe(2);
    expect(el.textContent).toContain('não indicam um local específico');
    expect(el.textContent).toContain('SAMU: 192');
    expect(el.textContent).toContain('188');
    expect(el.textContent).toContain('não acessa a sua localização');
  });

  it('sem região, os links buscam "perto de mim" e abrem com rel seguro', async () => {
    const { el } = await setup();
    expect(el.textContent).toContain('Região não informada');
    expect(links(el).map((a) => a.href)).toEqual([
      'https://www.google.com/maps/search/?api=1&query=UBS%20perto%20de%20mim',
      'https://www.google.com/maps/search/?api=1&query=CAPS%20perto%20de%20mim',
    ]);
    expect(links(el).every((a) => a.rel.includes('noopener'))).toBe(true);
  });

  it('informar a região atualiza os links e persiste', async () => {
    const { fixture, el } = await setup();
    (Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.includes('Informar região')) as HTMLButtonElement).click();
    fixture.detectChanges();
    const input = el.querySelector('#region') as HTMLInputElement;
    input.value = 'Nova Iguaçu, RJ';
    input.dispatchEvent(new Event('input'));
    el.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
    expect(el.textContent).toContain('Nova Iguaçu, RJ');
    expect(links(el)[0].href).toContain('UBS%20Nova%20Igua%C3%A7u%2C%20RJ');
    expect(JSON.parse(localStorage.getItem('bm:region')!)).toBe('Nova Iguaçu, RJ');
    expect(el.textContent).toContain('Alterar região');
  });

  it('cancelar a edição mantém a região anterior', async () => {
    const { fixture, el } = await setup();
    (Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.includes('Informar região')) as HTMLButtonElement).click();
    fixture.detectChanges();
    (Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.includes('Cancelar')) as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(el.textContent).toContain('Região não informada');
  });
});
