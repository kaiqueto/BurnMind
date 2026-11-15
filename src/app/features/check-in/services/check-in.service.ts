import { Injectable, computed, inject, signal } from '@angular/core';
import { DailyCheckIn, EnergyLevel, MoodLevel } from '../../../shared/models/burnoutmind.models';
import { toIsoDate } from '../../../shared/utils/date';
import { CheckInRepository } from './check-in.repository';

export interface CheckInInput {
  mood: MoodLevel;
  energy: EnergyLevel;
  note?: string;
}

/** Estado dos check-ins. Um registro por dia (RN-04); salvar de novo no mesmo dia edita (RF-06). */
@Injectable({ providedIn: 'root' })
export class CheckInService {
  private readonly repository = inject(CheckInRepository);
  private readonly _checkIns = signal<DailyCheckIn[]>([]);

  readonly checkIns = this._checkIns.asReadonly();
  readonly today = computed(() => {
    const iso = toIsoDate(new Date());
    return this._checkIns().find((c) => c.date === iso) ?? null;
  });

  /** Carga inicial; `save` espera por ela para não sobrescrever registros ainda não lidos. */
  private readonly ready = this.repository
    .list()
    .then((list) => this._checkIns.set(list))
    .catch(() => undefined);

  async save(input: CheckInInput): Promise<DailyCheckIn> {
    await this.ready;
    const date = toIsoDate(new Date());
    const now = new Date().toISOString();
    const existing = this._checkIns().find((c) => c.date === date);
    const note = input.note?.trim();

    const checkIn: DailyCheckIn = {
      id: existing?.id ?? crypto.randomUUID(),
      date,
      mood: input.mood,
      energy: input.energy,
      ...(note ? { note } : {}),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    await this.repository.save(checkIn); // lança 'storage-unavailable' se não gravar
    this._checkIns.update((list) =>
      [...list.filter((c) => c.date !== date), checkIn].sort((a, b) => a.date.localeCompare(b.date)),
    );
    return checkIn;
  }
}
