import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}
