import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateHabito, Habito } from '../interface/habito.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HabitoService {
  private baseUrl = `${environment.apiUrl}/habitos`;

  constructor(private http: HttpClient) {}

  getHabitos(): Observable<Habito[]> {
    return this.http.get<Habito[]>(this.baseUrl);
  }

  postHabitos(body: Habito): Observable<Habito> {
    return this.http.post<Habito>(this.baseUrl, body);
  }

  deleteHabitos(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);

    //I could do like this - return this.http.delete<any>(this.baseUrl + '/' + id);
  }

  editHabitos(id: number, body: Partial<Habito>) {
    return this.http.put<Habito>(`${this.baseUrl}/${id}`, body);
  }
}
