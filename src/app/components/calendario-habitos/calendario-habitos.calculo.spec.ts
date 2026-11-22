import { CalendarioMesResponse } from '../../interface/historico.model';
import {
  CORES_PADRAO,
  calcularDiasElegiveis,
  chaveConclusao,
  dataLocalIso,
  diasNoMes,
  montarCalendario,
  periodoAnterior,
  proximoPeriodo,
  resolverIcone,
} from './calendario-habitos.calculo';

/** Sábado, 21 de novembro de 2026 (mês 11). */
const HOJE = new Date(2026, 10, 21, 10, 30);

function resposta(parcial: Partial<CalendarioMesResponse> = {}): CalendarioMesResponse {
  return {
    ano: 2026,
    mes: 11,
    habitos: [
      { id: 1, nome: 'Estudar Java', descricao: 'Estudar Java por 1 hora', color: '#3b82f6', icon: 'assets/svg/icon-code.svg' },
      { id: 2, nome: 'Beber água', descricao: 'Beber 2 litros de água', color: null, icon: 'water_drop' },
    ],
    conclusoes: [
      { habitoId: 1, data: '2026-11-20' },
      { habitoId: 1, data: '2026-11-21' },
      { habitoId: 2, data: '2026-11-21' },
    ],
    ...parcial,
  };
}

describe('calendario-habitos.calculo', () => {
  describe('diasNoMes', () => {
    it('retorna 30 para novembro e 31 para dezembro', () => {
      expect(diasNoMes(2026, 11)).toBe(30);
      expect(diasNoMes(2026, 12)).toBe(31);
    });

    it('retorna 28 em fevereiro comum e 29 em ano bissexto', () => {
      expect(diasNoMes(2026, 2)).toBe(28);
      expect(diasNoMes(2028, 2)).toBe(29);
    });
  });

  describe('montarCalendario', () => {
    it('gera uma coluna por dia do mês', () => {
      expect(montarCalendario(resposta(), HOJE, null).colunas.length).toBe(30);

      const fevereiro = montarCalendario(resposta({ ano: 2026, mes: 2, conclusoes: [] }), HOJE, null);
      expect(fevereiro.colunas.length).toBe(28);

      const fevereiroBissexto = montarCalendario(
        resposta({ ano: 2024, mes: 2, conclusoes: [] }),
        HOJE,
        null,
      );
      expect(fevereiroBissexto.colunas.length).toBe(29);
    });

    it('calcula dia da semana abreviado em pt-BR', () => {
      const cal = montarCalendario(resposta(), HOJE, null);
      expect(cal.colunas[0].diaSemana).toBe('Dom'); // 1/11/2026
      expect(cal.colunas[20].diaSemana).toBe('Sáb'); // 21/11/2026
    });

    it('marca hoje, dias futuros e o dia selecionado', () => {
      const cal = montarCalendario(resposta(), HOJE, '2026-11-20');
      const dia20 = cal.colunas[19];
      const dia21 = cal.colunas[20];
      const dia22 = cal.colunas[21];

      expect(dia20.selecionado).toBeTrue();
      expect(dia21.hoje).toBeTrue();
      expect(dia21.futuro).toBeFalse();
      expect(dia22.futuro).toBeTrue();
      expect(cal.colunas.filter((c) => c.futuro).length).toBe(9);
    });

    it('marca células concluídas e monta aria-label', () => {
      const cal = montarCalendario(resposta(), HOJE, null);
      const [java, agua] = cal.colunas[19].celulas; // dia 20

      expect(java.concluido).toBeTrue();
      expect(java.ariaLabel).toBe('Estudar Java, 20 de novembro: concluído');
      expect(agua.concluido).toBeFalse();
      expect(agua.ariaLabel).toBe('Beber água, 20 de novembro: não concluído');
      expect(cal.colunas[25].celulas[0].ariaLabel).toBe('Estudar Java, 26 de novembro: data futura');
    });

    it('calcula progresso por hábito: 2 conclusões em 21 dias elegíveis = 10%', () => {
      const cal = montarCalendario(resposta(), HOJE, null);
      const [java, agua] = cal.progresso;

      expect(cal.diasElegiveis).toBe(21);
      expect(java.concluidos).toBe(2);
      expect(java.elegiveis).toBe(21);
      expect(java.percentual).toBe(10);
      expect(agua.concluidos).toBe(1);
      expect(agua.percentual).toBe(5);
      expect(cal.totalConclusoes).toBe(3);
    });

    it('usa o mês inteiro como elegível em meses passados', () => {
      const cal = montarCalendario(
        resposta({ ano: 2026, mes: 10, conclusoes: [{ habitoId: 1, data: '2026-10-05' }] }),
        HOJE,
        null,
      );
      expect(cal.diasElegiveis).toBe(31);
      expect(cal.mesAtual).toBeFalse();
      expect(cal.colunas.every((c) => !c.futuro)).toBeTrue();
      expect(cal.progresso[0].percentual).toBe(3); // 1/31
    });

    it('ignora conclusões duplicadas, de outro mês ou de hábito desconhecido', () => {
      const cal = montarCalendario(
        resposta({
          conclusoes: [
            { habitoId: 1, data: '2026-11-20' },
            { habitoId: 1, data: '2026-11-20' },
            { habitoId: 1, data: '2026-10-31' },
            { habitoId: 99, data: '2026-11-20' },
          ],
        }),
        HOJE,
        null,
      );
      expect(cal.totalConclusoes).toBe(1);
      expect(cal.progresso[0].concluidos).toBe(1);
    });

    it('hábito preto ganha destaque e borda claros; cores normais repetem a própria cor', () => {
      const cal = montarCalendario(
        resposta({
          habitos: [
            { id: 1, nome: 'Meditar', descricao: null, color: '#0A0A0A', icon: 'psychology' },
            { id: 2, nome: 'Ler', descricao: null, color: '#22C55E', icon: 'menu_book' },
          ],
        }),
        HOJE,
        null,
      );
      expect(cal.habitos[0]).toEqual(
        jasmine.objectContaining({ cor: '#0A0A0A', destaque: '#e2e8f0', borda: '#475569' }),
      );
      expect(cal.habitos[1]).toEqual(
        jasmine.objectContaining({ cor: '#22C55E', destaque: '#22C55E', borda: '#22C55E' }),
      );
    });

    it('usa cor padrão quando o hábito não tem cor e resolve o ícone', () => {
      const cal = montarCalendario(resposta(), HOJE, null);
      expect(cal.habitos[0].cor).toBe('#3b82f6');
      expect(cal.habitos[1].cor).toBe(CORES_PADRAO[1]);
      expect(cal.habitos[0].icone).toBe('code');
      expect(cal.habitos[1].icone).toBe('water');
    });

    it('tira o prefixo "Meta:" salvo por engano na descrição', () => {
      const cal = montarCalendario(
        resposta({
          habitos: [
            { id: 1, nome: 'Idiomas', descricao: 'Meta: Estudar idiomas 1 vez', color: '#3b82f6', icon: 'translate' },
            { id: 2, nome: 'Ler', descricao: null, color: '#22d3ee', icon: 'book' },
          ],
        }),
        HOJE,
        null,
      );
      expect(cal.habitos[0].descricao).toBe('Estudar idiomas 1 vez');
      expect(cal.habitos[1].descricao).toBe('');
    });

    it('monta o resumo do dia selecionado', () => {
      const resumo = montarCalendario(resposta(), HOJE, '2026-11-21').resumo!;

      expect(resumo.dia).toBe(21);
      expect(resumo.nomeMes).toBe('novembro');
      expect(resumo.ano).toBe(2026);
      expect(resumo.diaSemana).toBe('sábado');
      expect(resumo.hoje).toBeTrue();
      expect(resumo.total).toBe(2);
      expect(resumo.concluidos).toBe(2);
      expect(resumo.pendentes).toBe(0);
      expect(resumo.percentual).toBe(100);
    });

    it('resumo com 0 conclusões', () => {
      const resumo = montarCalendario(resposta(), HOJE, '2026-11-05').resumo!;
      expect(resumo.concluidos).toBe(0);
      expect(resumo.pendentes).toBe(2);
      expect(resumo.percentual).toBe(0);
      expect(resumo.itens.every((i) => !i.concluido)).toBeTrue();
    });

    it('não gera resumo sem seleção ou com dia futuro selecionado', () => {
      expect(montarCalendario(resposta(), HOJE, null).resumo).toBeNull();
      expect(montarCalendario(resposta(), HOJE, '2026-11-25').resumo).toBeNull();
    });
  });

  describe('auxiliares', () => {
    it('chaveConclusao usa "yyyy-MM-dd|habitoId"', () => {
      expect(chaveConclusao('2026-11-21', 3)).toBe('2026-11-21|3');
    });

    it('dataLocalIso não sofre deslocamento de fuso (UTC)', () => {
      expect(dataLocalIso(new Date(2026, 10, 21, 23, 59))).toBe('2026-11-21');
    });

    it('calcularDiasElegiveis', () => {
      expect(calcularDiasElegiveis({ ano: 2026, mes: 11 }, HOJE)).toBe(21);
      expect(calcularDiasElegiveis({ ano: 2026, mes: 9 }, HOJE)).toBe(30);
      expect(calcularDiasElegiveis({ ano: 2026, mes: 12 }, HOJE)).toBe(0);
    });

    it('periodoAnterior e proximoPeriodo viram o ano', () => {
      expect(periodoAnterior({ ano: 2026, mes: 1 })).toEqual({ ano: 2025, mes: 12 });
      expect(proximoPeriodo({ ano: 2026, mes: 12 })).toEqual({ ano: 2027, mes: 1 });
    });

    it('resolverIcone aceita chave nova e valores antigos, e cai no padrão se desconhecido', () => {
      expect(resolverIcone('book')).toBe('book');
      expect(resolverIcone('assets/png/icon-study.png')).toBe('book');
      expect(resolverIcone('bedtime')).toBe('sleep');
      expect(resolverIcone('footprint')).toBe('walk');
      expect(resolverIcone('qualquer-coisa')).toBe('padrao');
      expect(resolverIcone(null)).toBe('padrao');
    });
  });
});
