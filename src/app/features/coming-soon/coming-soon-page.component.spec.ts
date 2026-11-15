import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ComingSoonPageComponent } from './coming-soon-page.component';

describe('ComingSoonPageComponent', () => {
  it('mostra o aviso e o caminho de volta', async () => {
    await TestBed.configureTestingModule({ imports: [ComingSoonPageComponent], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(ComingSoonPageComponent);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain('Em breve');
  });
});
