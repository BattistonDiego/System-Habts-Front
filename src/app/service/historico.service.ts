import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalendarioMesResponse, HistoricoRegistro } from '../interface/historico.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HistoricoService {
  private baseUrl = `${environment.apiUrl}/historico`;

  constructor(private http: HttpClient) {}

  postHistorico(body: Pick<HistoricoRegistro, 'habitoId' | 'concluido'>): Observable<HistoricoRegistro> {
    return this.http.post<HistoricoRegistro>(this.baseUrl, body);
  }

  getListHistorico(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  //http://localhost:8080/historico/data?date=2025-11-26

  getListHistoricoByDate(date: string): Observable<HistoricoRegistro[]> {
    const params = new HttpParams().set('date', date);

    return this.http.get<HistoricoRegistro[]>(`${this.baseUrl}/data`, { params });
  }

  getStreak(habitoId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/streak/` + habitoId);
  }

  getResumoSemanal(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/resumo-semanal/${usuarioId}`);
  }

  getMelhorSequencia(usuarioId: number, habitoId: number): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/melhor-sequencia/${usuarioId}/${habitoId}`);
  }

  getqntdHabitosEsteMes(usuarioId: number): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/este-mes/${usuarioId}`);
  }

  getMediaHabitoCompletado(usuarioId: number): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/taxa-media/${usuarioId}`);
  }

  getEstatisticas(habitoId: number): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/${habitoId}/estatisticas`);
  }

  /** Hábitos do usuário logado e suas conclusões no mês (mes de 1 a 12). */
  buscarMes(ano: number, mes: number): Observable<CalendarioMesResponse> {
    const params = new HttpParams().set('ano', ano).set('mes', mes);
    return this.http.get<CalendarioMesResponse>(`${this.baseUrl}/mes`, { params });
  }

  getAtividades(): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/atividade`);
  }
}
