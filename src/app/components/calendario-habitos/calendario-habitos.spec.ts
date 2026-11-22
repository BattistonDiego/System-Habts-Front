import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { CalendarioHabitosComponent } from './calendario-habitos';
import { HistoricoService } from '../../service/historico.service';
import { CalendarioMesResponse } from '../../interface/historico.model';

/** Sábado, 21 de novembro de 2026. */
const HOJE = new Date(2026, 10, 21, 10, 0);

function respostaDoMes(ano: number, mes: number): CalendarioMesResponse {
  return {
    ano,
    mes,
    habitos: [
      { id: 1, nome: 'Estudar Java', descricao: 'Estudar Java por 1 hora', color: '#3b82f6', icon: 'code' },
      { id: 2, nome: 'Beber água', descricao: 'Beber 2 litros de água', color: '#22d3ee', icon: 'water_drop' },
    ],
    conclusoes:
      ano === 2026 && mes === 11
        ? [
            { habitoId: 1, data: '2026-11-20' },
            { habitoId: 1, data: '2026-11-21' },
            { habitoId: 2, data: '2026-11-21' },
          ]
        : [],
  };
}

describe('CalendarioHabitosComponent', () => {
  let fixture: ComponentFixture<CalendarioHabitosComponent>;
  let component: CalendarioHabitosComponent;
  let historicoService: jasmine.SpyObj<HistoricoService>;
  let el: HTMLElement;

  const $ = (seletor: string) => el.querySelector<HTMLElement>(seletor);
  const $$ = (seletor: string) => Array.from(el.querySelectorAll<HTMLElement>(seletor));
  const texto = (seletor: string) => $(seletor)?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  const colunas = () => $$('[data-testid="coluna-dia"]');
  /** Célula (botão) do hábito `indiceHabito` no dia `dia` (1-based). */
  const celula = (dia: number, indiceHabito = 0) =>
    colunas()[dia - 1].querySelectorAll<HTMLButtonElement>('[data-testid="celula"]')[indiceHabito];
  const clicar = (alvo: HTMLElement) => {
    alvo.click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(HOJE);

    historicoService = jasmine.createSpyObj<HistoricoService>('HistoricoService', ['buscarMes']);
    historicoService.buscarMes.and.callFake((ano: number, mes: number) => of(respostaDoMes(ano, mes)));

    await TestBed.configureTestingModule({
      imports: [CalendarioHabitosComponent],
      providers: [{ provide: HistoricoService, useValue: historicoService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarioHabitosComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('carrega o mês atual na inicialização', () => {
    expect(historicoService.buscarMes).toHaveBeenCalledOnceWith(2026, 11);
    expect(texto('[data-testid="titulo-mes"]')).toBe('Novembro 2026');
    expect(texto('[data-testid="subtitulo"]')).toBe('3 conclusões em 21 dias até hoje');
  });

  it('renderiza uma coluna por dia do mês (30 em novembro)', () => {
    expect(colunas().length).toBe(30);
    expect(texto('[data-testid="coluna-dia"]:first-child .dia-semana')).toBe('Dom');
  });

  it('renderiza 28 colunas em fevereiro de 2026', () => {
    for (let i = 0; i < 9; i++) clicar($('[data-testid="mes-anterior"]')!);

    expect(historicoService.buscarMes).toHaveBeenCalledWith(2026, 2);
    expect(texto('[data-testid="titulo-mes"]')).toBe('Fevereiro 2026');
    expect(colunas().length).toBe(28);
  });

  it('desabilita as células dos dias futuros e mantém os passados habilitados', () => {
    expect(celula(21).disabled).toBeFalse();
    expect(celula(22).disabled).toBeTrue();
    expect(celula(30, 1).disabled).toBeTrue();
    expect(celula(22).getAttribute('aria-label')).toBe('Estudar Java, 22 de novembro: data futura');
  });

  it('desabilita o botão › no mês atual e habilita em meses passados', () => {
    const proximo = () => $('[data-testid="proximo-mes"]') as HTMLButtonElement;
    expect(proximo().disabled).toBeTrue();

    clicar($('[data-testid="mes-anterior"]')!);
    expect(proximo().disabled).toBeFalse();
  });

  it('destaca hoje e já mostra o painel do dia de hoje', () => {
    const hoje = colunas()[20];
    expect(hoje.classList).toContain('hoje');
    expect(hoje.classList).toContain('selecionada');
    expect(texto('[data-testid="painel-titulo"]')).toBe('Atividades de 21 de novembro de 2026');
    expect(texto('[data-testid="painel-dia-semana"]')).toBe('Sábado · hoje');
    expect(texto('[data-testid="resumo-concluidos"]')).toBe('2 de 2');
    expect(texto('[data-testid="resumo-percentual"]')).toBe('100%');
  });

  it('marca célula concluída com check e aria-label', () => {
    const concluida = celula(20);
    expect(concluida.classList).toContain('concluida');
    expect(concluida.querySelector('svg')).not.toBeNull();
    expect(concluida.getAttribute('aria-label')).toBe('Estudar Java, 20 de novembro: concluído');
    expect(celula(20, 1).classList).not.toContain('concluida');
  });

  it('clicar num dia seleciona a coluna e atualiza o painel', () => {
    clicar(celula(20, 1));

    expect(colunas()[19].classList).toContain('selecionada');
    expect(colunas()[20].classList).not.toContain('selecionada');
    expect(texto('[data-testid="painel-titulo"]')).toBe('Atividades de 20 de novembro de 2026');
    expect(texto('[data-testid="painel-dia-semana"]')).toBe('Sexta-feira');
    expect(texto('[data-testid="resumo-concluidos"]')).toBe('1 de 2');
    expect(texto('[data-testid="resumo-pendentes"]')).toBe('1');
    expect(texto('[data-testid="resumo-percentual"]')).toBe('50%');

    const itens = $$('[data-testid="item-dia"]');
    expect(itens.length).toBe(2);
    expect(itens[0].textContent).toContain('Meta: Estudar Java por 1 hora');
    expect(itens[0].textContent).toContain('Concluído');
    expect(itens[1].textContent).toContain('Não concluído');
  });

  it('clicar numa célula não chama a API nem marca o hábito', () => {
    historicoService.buscarMes.calls.reset();
    clicar(celula(5));
    expect(historicoService.buscarMes).not.toHaveBeenCalled();
    expect(celula(5).classList).not.toContain('concluida');
  });

  it('mostra o estado vazio quando o dia tem 0 conclusões', () => {
    clicar(celula(5));

    expect($('[data-testid="estado-vazio"]')?.textContent).toContain(
      'Nenhum hábito registrado neste dia',
    );
    expect($$('[data-testid="item-dia"]').length).toBe(0);
    expect(texto('[data-testid="resumo-concluidos"]')).toBe('0 de 2');
  });

  it('hábito preto continua legível: borda clara na célula/ponto e traço claro no anel/faixa', () => {
    historicoService.buscarMes.and.returnValue(
      of({
        ano: 2026,
        mes: 10,
        habitos: [{ id: 5, nome: 'Meditar', descricao: 'Meditar 10 minutos', color: '#0A0A0A', icon: 'psychology' }],
        conclusoes: [{ habitoId: 5, data: '2026-10-05' }],
      }),
    );
    clicar($('[data-testid="mes-anterior"]')!);
    clicar(celula(5));

    const cor = (alvo: Element, prop: keyof CSSStyleDeclaration) => getComputedStyle(alvo)[prop];
    const preto = 'rgb(10, 10, 10)';
    const bordaClara = 'rgb(71, 85, 105)'; // #475569
    const destaque = 'rgb(226, 232, 240)'; // #e2e8f0

    expect(cor(celula(5), 'backgroundColor')).toBe(preto);
    expect(cor(celula(5), 'borderTopColor')).toBe(bordaClara);
    expect(cor($('.habito .ponto')!, 'backgroundColor')).toBe(preto);
    expect(cor($('.habito .ponto')!, 'borderTopColor')).toBe(bordaClara);
    expect(cor($('.habito .icone-habito')!, 'color')).toBe(destaque);
    expect(cor($('.anel-valor')!, 'stroke')).toBe(destaque);
    expect(cor($('[data-testid="item-dia"] .faixa')!, 'backgroundColor')).toBe(destaque);
  });

  it('mostra o progresso por hábito (2 conclusões em 21 dias = 10%)', () => {
    const progresso = $$('[data-testid="progresso"]');
    expect(progresso.length).toBe(2);
    expect(progresso[0].querySelector('[data-testid="progresso-contagem"]')?.textContent).toBe(
      '2/21',
    );
    expect(progresso[0].querySelector('.anel-pct')?.textContent).toBe('10%');
    expect(progresso[0].querySelector('.anel')?.getAttribute('aria-label')).toBe(
      'Estudar Java: 10% (2 de 21 dias)',
    );
    expect(progresso[1].querySelector('.anel-pct')?.textContent).toBe('5%');
  });

  it('troca de mês chama buscarMes com os parâmetros certos', () => {
    clicar($('[data-testid="mes-anterior"]')!);
    expect(historicoService.buscarMes).toHaveBeenCalledWith(2026, 10);
    expect(texto('[data-testid="titulo-mes"]')).toBe('Outubro 2026');
    expect(colunas().length).toBe(31);

    clicar($('[data-testid="proximo-mes"]')!);
    expect(historicoService.buscarMes).toHaveBeenCalledWith(2026, 11);
    expect(historicoService.buscarMes).toHaveBeenCalledTimes(3);
  });

  it('vira o ano ao voltar de janeiro para dezembro', () => {
    for (let i = 0; i < 11; i++) clicar($('[data-testid="mes-anterior"]')!);
    expect(historicoService.buscarMes).toHaveBeenCalledWith(2025, 12);
    expect(texto('[data-testid="titulo-mes"]')).toBe('Dezembro 2025');
  });

  it('em meses passados não há dia selecionado e o painel pede para selecionar', () => {
    clicar($('[data-testid="mes-anterior"]')!);

    expect($$('.coluna-dia.selecionada').length).toBe(0);
    expect($('[data-testid="selecione-dia"]')?.textContent).toContain('Selecione um dia');
    expect(texto('[data-testid="subtitulo"]')).toBe('0 conclusões em 31 dias');
  });

  it('"Hoje" volta ao mês atual e seleciona o dia de hoje', () => {
    clicar($('[data-testid="mes-anterior"]')!);
    clicar($('[data-testid="btn-hoje"]')!);

    expect(historicoService.buscarMes.calls.mostRecent().args).toEqual([2026, 11]);
    expect(colunas()[20].classList).toContain('selecionada');
    expect(texto('[data-testid="painel-titulo"]')).toBe('Atividades de 21 de novembro de 2026');
  });

  it('"Hoje" no mês atual só reseleciona hoje, sem recarregar', () => {
    clicar(celula(3));
    historicoService.buscarMes.calls.reset();

    clicar($('[data-testid="btn-hoje"]')!);

    expect(historicoService.buscarMes).not.toHaveBeenCalled();
    expect(colunas()[20].classList).toContain('selecionada');
  });

  it('mostra mensagem de erro se a API falhar', () => {
    historicoService.buscarMes.and.returnValue(throwError(() => new Error('falha')));
    clicar($('[data-testid="mes-anterior"]')!);

    expect(el.textContent).toContain('Não foi possível carregar o calendário.');
    expect($('[data-testid="painel-dia"]')).toBeNull();
    expect(component.estado()).toBe('erro');
  });
});
