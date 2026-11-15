import { Injectable, inject } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';
import { DailyCheckIn, IsoDate } from '../../../shared/models/burnoutmind.models';

/**
 * Contrato de persistência dos check-ins.
 * Métodos assíncronos para que trocar localStorage por uma API não altere os consumidores.
 */
export abstract class CheckInRepository {
  abstract list(): Promise<DailyCheckIn[]>;
  abstract getByDate(date: IsoDate): Promise<DailyCheckIn | null>;
  abstract save(checkIn: DailyCheckIn): Promise<void>;
}

/** Implementação do MVP: localStorage (um registro por data — RN-04). */
@Injectable()
export class LocalStorageCheckInRepository extends CheckInRepository {
  private readonly storage = inject(StorageService);
  private readonly key = 'checkins';

  async list(): Promise<DailyCheckIn[]> {
    return this.storage.get<DailyCheckIn[]>(this.key) ?? [];
  }

  async getByDate(date: IsoDate): Promise<DailyCheckIn | null> {
    return (await this.list()).find((c) => c.date === date) ?? null;
  }

  async save(checkIn: DailyCheckIn): Promise<void> {
    const others = (await this.list()).filter((c) => c.date !== checkIn.date);
    const saved = this.storage.set(this.key, [...others, checkIn].sort((a, b) => a.date.localeCompare(b.date)));
    if (!saved) throw new Error('storage-unavailable');
  }
}
