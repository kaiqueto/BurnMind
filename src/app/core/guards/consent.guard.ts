import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ConsentService } from '../services/consent.service';

/** Bloqueia o questionário sem consentimento explícito (RN-01) e manda para as boas-vindas. */
export const consentGuard: CanActivateFn = () =>
  inject(ConsentService).hasConsent() ? true : inject(Router).createUrlTree(['/boas-vindas']);
