import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { EducationLibraryPageComponent } from './education-library-page.component';
import { TopicDetailModalComponent } from './components/topic-detail-modal/topic-detail-modal.component';

describe('Biblioteca educativa', () => {
  describe('página', () => {
    async function setup() {
      await TestBed.configureTestingModule({ imports: [EducationLibraryPageComponent], providers: [provideRouter([])] }).compileComponents();
      const fixture = TestBed.createComponent(EducationLibraryPageComponent);
      await fixture.whenStable();
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      const type = (value: string) => {
        const input = el.querySelector('input[type=search]') as HTMLInputElement;
        input.value = value;
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
      };
      return { el, type };
    }

    it('lista os 5 temas e os avisos do wireframe', async () => {
      const { el } = await setup();
      expect(el.querySelectorAll('bm-topic-card').length).toBe(5);
      expect(el.textContent).toContain('Aprender não é se diagnosticar');
      expect(el.textContent).toContain('Burnout é um fenômeno ocupacional');
    });

    it('só o Burnout é link; os outros mostram "Conteúdo em breve"', async () => {
      const { el } = await setup();
      expect(el.querySelectorAll('a.bm-topic-card').length).toBe(1);
      expect(el.querySelector('a.bm-topic-card')?.getAttribute('href')).toBe('/doencas/burnout');
      expect(el.querySelectorAll('.bm-topic-card--soon').length).toBe(4);
      expect(el.textContent).toContain('Conteúdo em breve');
    });

    it('filtra por busca sem acento e mostra mensagem quando não acha', async () => {
      const { el, type } = await setup();
      type('depressao');
      expect(el.querySelectorAll('bm-topic-card').length).toBe(1);
      expect(el.textContent).toContain('1 tema encontrado');
      type('zzz');
      expect(el.querySelectorAll('bm-topic-card').length).toBe(0);
      expect(el.textContent).toContain('Nenhum tema encontrado');
    });
  });

  describe('modal', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [TopicDetailModalComponent], providers: [provideRouter([])] }).compileComponents();
    });

    async function open(slug: string) {
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
      const fixture = TestBed.createComponent(TopicDetailModalComponent);
      fixture.componentRef.setInput('slug', slug);
      await fixture.whenStable();
      fixture.detectChanges();
      return { el: fixture.nativeElement as HTMLElement, navigate };
    }

    it('mostra o conteúdo do burnout com os 3 sinais e o aviso de não diagnóstico', async () => {
      const { el } = await open('burnout');
      expect(el.querySelector('dialog')?.getAttribute('aria-labelledby')).toBe('topic-title');
      expect(el.querySelector('#topic-title')?.textContent).toContain('Entendendo o burnout');
      expect(el.querySelectorAll('ul li').length).toBe(3);
      expect(el.textContent).toContain('Prevenção é também coletiva');
      expect(el.textContent).toContain('Sinais isolados não confirmam diagnóstico');
    });

    it('fecha e volta para /doencas', async () => {
      const { el, navigate } = await open('burnout');
      (el.querySelector('.btn-outline-secondary') as HTMLButtonElement).click();
      await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith('/doencas'));
    });

    it('tema sem conteúdo ou inexistente volta para a lista', async () => {
      const a = await open('anxiety');
      await vi.waitFor(() => expect(a.navigate).toHaveBeenCalledWith('/doencas'));
      expect(a.el.querySelector('dialog')).toBeNull();
    });
  });
});
