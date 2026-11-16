import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Habito, HabitoApiResponse } from '../interface/habito.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HabitoService {
  private baseUrl = `${environment.apiUrl}/habitos`;

  constructor(private http: HttpClient) {}

  getHabitos(): Observable<Habito[]> {
    return this.http
      .get<HabitoApiResponse[]>(this.baseUrl)
      .pipe(map((habitos) => habitos.map((habito) => this.fromApi(habito))));
  }

  postHabitos(body: Partial<Habito> & { usuarioId?: number; icon?: string; color?: string }): Observable<any> {
    const payload = {
      usuarioId: body.usuarioId ?? body.usuario?.id,
      nome: body.nome,
      icon: body.icon ?? body.icone,
      color: body.color ?? body.cor,
    };
    return this.http.post<any>(this.baseUrl, payload);
  }

  deleteHabitos(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);

    //I could do like this - return this.http.delete<any>(this.baseUrl + '/' + id);
  }

  editHabitos(id: number, body: Partial<Habito>) {
    return this.http.put<any>(`${this.baseUrl}/${id}`, {
      nome: body.nome,
      icon: body.icon ?? body.icone,
      color: body.color ?? body.cor,
    }).pipe(map((habito) => this.fromApi(habito)));
  }

  private fromApi(habito: HabitoApiResponse): Habito {
    return {
      ...habito,
      meta: 1,
      unidade: 'vez',
      icone: habito.icon,
      cor: habito.color,
      current: 0,
      concluidoHoje: false,
    };
  }
}
