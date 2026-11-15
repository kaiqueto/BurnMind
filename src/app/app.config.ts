import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import {
  CheckInRepository,
  LocalStorageCheckInRepository,
} from './features/check-in/services/check-in.repository';

import { ChatResponder, ScriptedChatResponder } from './features/chat/chat-responder';

registerLocaleData(localePt, 'pt-BR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    // Trocar por uma implementação de API quando o backend existir.
    { provide: CheckInRepository, useClass: LocalStorageCheckInRepository },
    // Respostas roteirizadas. Trocar por outra implementação de ChatResponder se a equipe optar por IA.
    { provide: ChatResponder, useClass: ScriptedChatResponder },
  ],
};
