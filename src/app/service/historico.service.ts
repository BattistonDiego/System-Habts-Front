import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateHabito, Habito } from '../interface/habito.model';

@Injectable({
  providedIn: 'root',
})
export class HistoricoService {
  private baseUrl = 'http://localhost:8080/historico';

  constructor(private http: HttpClient) {}

  postHistorico(body: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, body);
  }

  getListHistorico(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  //http://localhost:8080/historico/data?date=2025-11-26

  getListHistoricoByDate(date: string): Observable<any> {
    const params = new HttpParams().set('date', date);

    return this.http.get<any>(`${this.baseUrl}/data`, { params });
  }
}
