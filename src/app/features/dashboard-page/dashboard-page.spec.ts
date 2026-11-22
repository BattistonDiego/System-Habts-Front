import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPage } from './dashboard-page';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideLocalePtBr } from '../../core/locale/locale-pt-br';
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
        provideLocalePtBr(),
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

  it('gráfico "Hábitos por dia": rótulos Seg…Dom, casando as chaves em inglês do backend', () => {
    const http = TestBed.inject(HttpTestingController);
    http.expectOne((req) => req.url.endsWith('/historico/resumo-semanal/1')).flush([
      { dia: 'Monday   ', quantidade: 2 },
      { dia: 'Saturday ', quantidade: 4 },
    ]);

    expect(component.barChartData.labels).toEqual(['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']);
    expect(component.barChartData.datasets[0].data).toEqual([2, 0, 0, 0, 0, 4, 0]);
  });

  it('com LOCALE_ID pt-BR, a saudação continua em português', () => {
    expect(component.getDataFormatada()).toMatch(
      /^(domingo|segunda-feira|terça-feira|quarta-feira|quinta-feira|sexta-feira|sábado), \d{1,2} de [a-zç]+$/,
    );
  });
});
