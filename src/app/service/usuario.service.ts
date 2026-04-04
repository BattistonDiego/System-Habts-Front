import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateHabito, Habito } from '../interface/habito.model';
import { User } from '../interface/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private baseUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {}

  postUser(usuario: User): Observable<any> {
    return this.http.post<any>(this.baseUrl, usuario);
  }

  getUserLogged(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/' + 'me');
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }
}
