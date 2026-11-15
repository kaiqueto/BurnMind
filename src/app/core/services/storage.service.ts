import { Injectable } from '@angular/core';

/**
 * Wrapper de localStorage com prefixo e try/catch.
 * O storage pode estar indisponível (modo privado, cota, bloqueio) — nunca deve quebrar a UI.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly prefix = 'bm:';

  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      return raw === null ? null : (JSON.parse(raw) as T);
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch {
      /* ignora */
    }
  }
}
