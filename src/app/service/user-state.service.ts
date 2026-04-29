import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interface/user.model';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private usuario$ = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('usuario')!));

  setUsuario(usuario: User) {
    this.usuario$.next(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuario() {
    return this.usuario$.asObservable();
  }
}
