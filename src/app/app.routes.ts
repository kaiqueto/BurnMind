import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { consentGuard } from './core/guards/consent.guard';
import { ConsentService } from './core/services/consent.service';

/**
 * Rotas do BurnoutMind. Cada etapa de desenvolvimento adiciona suas rotas aqui.
 * Etapas 1-4: home, boas-vindas, sobre, check-in, formulario/:step, resultados,
 * calendario, calendario/insights, perfis (+ modal /perfis/:slug).
 * Etapa 5: doencas (+ modal /doencas/:slug), chat, resultados/assistencia-proxima.
 */
export const routes: Routes = [
  // Primeiro acesso (sem consentimento) → boas-vindas; depois → home.
  { path: '', pathMatch: 'full', redirectTo: () => (inject(ConsentService).hasConsent() ? 'home' : 'boas-vindas') },
  {
    path: 'boas-vindas',
    title: 'Boas-vindas · BurnoutMind',
    loadComponent: () => import('./features/welcome/welcome-page.component').then((m) => m.WelcomePageComponent),
  },
  {
    path: 'sobre',
    title: 'Sobre · BurnoutMind',
    loadComponent: () => import('./features/about/about-page.component').then((m) => m.AboutPageComponent),
  },
  {
    path: 'check-in',
    title: 'Check-in diário · BurnoutMind',
    loadComponent: () => import('./features/check-in/check-in-page.component').then((m) => m.CheckInPageComponent),
  },
  {
    path: 'home',
    title: 'Home · BurnoutMind',
    loadComponent: () => import('./features/home/home-page.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'formulario/:step',
    title: 'Questionário · BurnoutMind',
    canActivate: [consentGuard],
    loadComponent: () =>
      import('./features/questionnaire/question-step-page.component').then((m) => m.QuestionStepPageComponent),
  },
  {
    path: 'resultados',
    title: 'Resultados · BurnoutMind',
    loadComponent: () => import('./features/results/results-page.component').then((m) => m.ResultsPageComponent),
  },
  {
    path: 'calendario',
    title: 'Calendário · BurnoutMind',
    loadComponent: () => import('./features/calendar/calendar-page.component').then((m) => m.CalendarPageComponent),
  },
  {
    path: 'calendario/insights',
    title: 'Insights · BurnoutMind',
    loadComponent: () => import('./features/insights/insights-page.component').then((m) => m.InsightsPageComponent),
  },
  {
    path: 'perfis',
    title: 'Perfis · BurnoutMind',
    loadComponent: () => import('./features/profiles/profiles-page.component').then((m) => m.ProfilesPageComponent),
    children: [
      {
        path: ':slug',
        title: 'Perfil · BurnoutMind',
        loadComponent: () =>
          import('./features/profiles/components/profile-detail-modal/profile-detail-modal.component').then(
            (m) => m.ProfileDetailModalComponent,
          ),
      },
    ],
  },
  {
    path: 'resultados/assistencia-proxima',
    title: 'Assistência próxima · BurnoutMind',
    loadComponent: () => import('./features/nearby-care/nearby-care-page.component').then((m) => m.NearbyCarePageComponent),
  },
  {
    path: 'doencas',
    title: 'Doenças · BurnoutMind',
    loadComponent: () =>
      import('./features/education-library/education-library-page.component').then((m) => m.EducationLibraryPageComponent),
    children: [
      {
        path: ':slug',
        title: 'Tema · BurnoutMind',
        loadComponent: () =>
          import('./features/education-library/components/topic-detail-modal/topic-detail-modal.component').then(
            (m) => m.TopicDetailModalComponent,
          ),
      },
    ],
  },
  {
    path: 'chat',
    title: 'Chat · BurnoutMind',
    loadComponent: () => import('./features/chat/chat-page.component').then((m) => m.ChatPageComponent),
  },
  { path: '**', redirectTo: 'home' },
];
