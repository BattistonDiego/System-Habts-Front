import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl = 'http://localhost:8080/habitos';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, senha });
  }

  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const token = this.getToken();
    if (!token) return null;

    return jwtDecode(token);
  }

  getUserEmail(): string | null {
    const user: any = this.getUser();
    return user ? user.sub : null;
  }
}
