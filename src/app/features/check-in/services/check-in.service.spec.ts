import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { StorageService } from '../../../core/services/storage.service';
import { CheckInRepository, LocalStorageCheckInRepository } from './check-in.repository';
import { CheckInService } from './check-in.service';

describe('CheckInService', () => {
  let service: CheckInService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: CheckInRepository, useClass: LocalStorageCheckInRepository }],
    });
    service = TestBed.inject(CheckInService);
  });

  it('não tem check-in hoje no início', () => {
    expect(service.today()).toBeNull();
  });

  it('salva o check-in de hoje', async () => {
    await service.save({ mood: 'tired', energy: 'low', note: '  dia cheio  ' });
    expect(service.today()?.mood).toBe('tired');
    expect(service.today()?.note).toBe('dia cheio');
  });

  it('mantém um único registro por dia (RN-04)', async () => {
    await service.save({ mood: 'tired', energy: 'low' });
    await service.save({ mood: 'good', energy: 'high' });
    expect(service.checkIns().length).toBe(1);
    expect(service.today()?.mood).toBe('good');
  });

  it('falha de forma explícita quando o armazenamento não grava', async () => {
    vi.spyOn(TestBed.inject(StorageService), 'set').mockReturnValue(false);
    await expect(service.save({ mood: 'good', energy: 'high' })).rejects.toThrow('storage-unavailable');
  });
});
