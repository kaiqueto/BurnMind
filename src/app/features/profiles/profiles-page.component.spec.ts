import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { ConsentService } from '../../core/services/consent.service';
import { QuestionnaireService } from '../questionnaire/services/questionnaire.service';
import { ProfileDetailModalComponent } from './components/profile-detail-modal/profile-detail-modal.component';
import { ProfilesPageComponent } from './profiles-page.component';

function answerWireframe() {
  TestBed.inject(ConsentService).give();
  const q = TestBed.inject(QuestionnaireService);
  q.setAnswer('exhaustion', 'severalDays');
  q.setAnswer('recovery', 'fewDays');
  q.setAnswer('routine', 'little');
  q.complete();
}

describe('Perfis', () => {
  beforeEach(() => localStorage.clear());

  it('lista os 3 perfis e destaca o do usuário', async () => {
    await TestBed.configureTestingModule({ imports: [ProfilesPageComponent], providers: [provideRouter([])] }).compileComponents();
    answerWireframe();
    const fixture = TestBed.createComponent(ProfilesPageComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('bm-profile-card').length).toBe(3);
    expect(el.textContent).toContain('Um perfil descreve um momento, não uma identidade');
    expect(el.querySelectorAll('.bm-chip').length).toBe(1);
    expect(el.querySelector('.bm-card--brand-soft')?.textContent).toContain('Sobrecarga e recuperação');
  });

  describe('modal', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [ProfileDetailModalComponent], providers: [provideRouter([])] }).compileComponents();
    });

    async function open(slug: string) {
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
      const fixture = TestBed.createComponent(ProfileDetailModalComponent);
      fixture.componentRef.setInput('slug', slug);
      await fixture.whenStable();
      fixture.detectChanges();
      return { fixture, el: fixture.nativeElement as HTMLElement, navigate };
    }

    it('mostra título, ajuda e aviso; "Nas suas respostas" só no perfil do usuário', async () => {
      answerWireframe();
      const { el } = await open('overload-recovery');
      expect(el.querySelector('dialog')?.getAttribute('aria-labelledby')).toBe('profile-title');
      expect(el.querySelector('#profile-title')?.textContent).toContain('Sobrecarga e recuperação');
      expect(el.textContent).toContain('Nas suas respostas');
      expect(el.textContent).toContain('Descanso ajudou em poucos dias.');
      expect(el.textContent).toContain('Este perfil não confirma burnout');
    });

    it('não mostra "Nas suas respostas" em perfil que não é do usuário', async () => {
      answerWireframe();
      const { el } = await open('room-to-recover');
      expect(el.textContent).not.toContain('Nas suas respostas');
    });

    it('fecha e volta para /perfis', async () => {
      const { el, navigate } = await open('fluctuating-rhythm');
      (el.querySelector('.btn-outline-secondary') as HTMLButtonElement).click();
      await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith('/perfis'));
    });

    it('slug inválido volta para /perfis', async () => {
      const { navigate } = await open('nao-existe');
      await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith('/perfis'));
    });
  });
});
