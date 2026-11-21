import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPage } from './dashboard-page';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(async () => {
    // O ngOnInit lê o usuário logado do localStorage.
    localStorage.setItem(
      'usuario',
      JSON.stringify({ id: 1, nome: 'Diego', email: 'diego@teste.com', perfil: 'USUARIO' }),
    );

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideRouter([]),
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        provideCharts(withDefaultRegisterables()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('usuario');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar o calendário de hábitos no lugar de "Atividade recente"', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-calendario-habitos')).not.toBeNull();
    expect(el.textContent).not.toContain('Atividade recente');
  });

  it('deve manter os gráficos "Hábitos por dia" e "Desempenho"', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Hábitos por dia');
    expect(el.textContent).toContain('Desempenho');
  });
});
