import { Injectable, signal } from '@angular/core';
import { User } from '../../shared/models/burnoutmind.models';

/**
 * Usuário atual.
 * [PENDENTE] Autenticação não definida: por enquanto usa o usuário "Ana" do wireframe.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  readonly user = signal<User>({ id: 'demo', name: 'Ana' });
}
