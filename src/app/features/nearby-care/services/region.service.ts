import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';

export const REGION_MAX_LENGTH = 80;

/** Região informada pelo usuário (texto livre, ex.: "São Paulo, SP"). Fica só no navegador; nenhuma localização é acessada. */
@Injectable({ providedIn: 'root' })
export class RegionService {
  private readonly storage = inject(StorageService);
  private readonly _region = signal(this.storage.get<string>('region') ?? '');
  readonly region = this._region.asReadonly();

  set(value: string): void {
    const clean = value.trim().slice(0, REGION_MAX_LENGTH);
    this._region.set(clean);
    if (clean) this.storage.set('region', clean);
    else this.storage.remove('region');
  }
}
