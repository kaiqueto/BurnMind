import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('renderiza cabeçalho, área principal e rodapé', async () => {
    await TestBed.configureTestingModule({ imports: [AppComponent], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('bm-header')).toBeTruthy();
    expect(el.querySelector('main#conteudo')).toBeTruthy();
    expect(el.querySelector('bm-footer')).toBeTruthy();
  });
});
