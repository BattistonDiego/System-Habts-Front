import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { HabitoService } from './habito.service';
import { environment } from '../../environments/environment';

describe('HabitoService', () => {
  let service: HabitoService;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/habitos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HabitoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('envia a cor preta como "color" ao criar um hábito', () => {
    service
      .postHabitos({ usuarioId: 1, nome: 'Meditar', icon: 'psychology', color: '#0A0A0A', descricao: '' })
      .subscribe();

    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(jasmine.objectContaining({ color: '#0A0A0A', icon: 'psychology' }));
    req.flush({});
  });

  it('envia a cor preta como "color" ao editar e devolve o hábito com a cor', () => {
    let corSalva: string | undefined;
    service.editHabitos(3, { nome: 'Meditar', color: '#0A0A0A' }).subscribe((h) => (corSalva = h.color));

    const req = http.expectOne(`${url}/3`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(jasmine.objectContaining({ color: '#0A0A0A' }));
    req.flush({ id: 3, nome: 'Meditar', icon: 'psychology', color: '#0A0A0A' });

    expect(corSalva).toBe('#0A0A0A');
  });
});
