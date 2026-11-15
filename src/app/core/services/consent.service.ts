import { Injectable, computed, inject, signal } from '@angular/core';
import { IsoDateTime } from '../../shared/models/burnoutmind.models';
import { StorageService } from './storage.service';

/** Consentimento explícito antes do questionário (RF-01, RN-01, LGPD). */
@Injectable({ providedIn: 'root' })
export class ConsentService {
  private readonly storage = inject(StorageService);
  private readonly _consentAt = signal<IsoDateTime | null>(this.storage.get<IsoDateTime>('consentAt'));

  readonly consentAt = this._consentAt.asReadonly();
  readonly hasConsent = computed(() => this._consentAt() !== null);

  give(): void {
    const now = new Date().toISOString();
    this.storage.set('consentAt', now);
    this._consentAt.set(now);
  }

  revoke(): void {
    this.storage.remove('consentAt');
    this._consentAt.set(null);
  }
}
