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

  getAllUsers(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<any>(this.baseUrl, { params });
  }

  getUserById(id: number) {
    const params = new HttpParams().set('id', id);

    return this.http.get<any>(this.baseUrl + '/byId', { params });
  }

  getResume(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/resume');
  }

  putInativeUser(user: User): Observable<any> {
    return this.http.put(this.baseUrl, user);
  }

  updateUser(id: number, user: User): Observable<any> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user);
  }
}
