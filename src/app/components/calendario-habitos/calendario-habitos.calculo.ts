import { CalendarioMesResponse } from '../../interface/historico.model';
import { corDeBorda, corDeDestaque } from '../../core/utils/cor-habito';

/** Cores usadas apenas quando o hábito não tem cor cadastrada (por índice). */
export const CORES_PADRAO = ['#3b82f6', '#22d3ee', '#10b981', '#f97316'] as const;

export const DIAS_SEMANA_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const;

export const DIAS_SEMANA_LONGOS = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
] as const;

export const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const;

export type IconeHabito =
  | 'code'
  | 'agua'
  | 'leitura'
  | 'exercicio'
  | 'mente'
  | 'idiomas'
  | 'sono'
  | 'caminhada'
  | 'padrao';

/** O backend guarda o ícone como caminho de asset (legado) ou nome de ícone Material. */
const MAPA_ICONES: Record<string, IconeHabito> = {
  'assets/svg/icon-code.svg': 'code',
  code: 'code',
  'assets/svg/icon-water.svg': 'agua',
  water_drop: 'agua',
  'assets/png/icon-study.png': 'leitura',
  menu_book: 'leitura',
  'assets/png/icon-workout.png': 'exercicio',
  fitness_center: 'exercicio',
  psychology: 'mente',
  translate: 'idiomas',
  bedtime: 'sono',
  footprint: 'caminhada',
};

/** Mês de 1 a 12, igual ao contrato da API. */
export interface Periodo {
  ano: number;
  mes: number;
}

export interface HabitoCalendario {
  id: number;
  nome: string;
  meta: string;
  /** Cor do hábito, usada em preenchimentos sólidos. */
  cor: string;
  /** Traços, ícones, tingimentos e faixa (claro quando `cor` é escura). */
  destaque: string;
  /** Borda de preenchimentos sólidos (clara quando `cor` é escura). */
  borda: string;
  icone: IconeHabito;
}

export interface CelulaCalendario {
  habito: HabitoCalendario;
  concluido: boolean;
  ariaLabel: string;
}

export interface ColunaDia {
  /** yyyy-MM-dd */
  data: string;
  dia: number;
  diaSemana: string;
  futuro: boolean;
  hoje: boolean;
  selecionado: boolean;
  celulas: CelulaCalendario[];
}

export interface ProgressoHabito {
  habito: HabitoCalendario;
  concluidos: number;
  elegiveis: number;
  percentual: number;
}

export interface ItemResumoDia {
  habito: HabitoCalendario;
  concluido: boolean;
}

export interface ResumoDia {
  data: string;
  dia: number;
  /** nome do mês em minúsculas, ex.: "novembro" */
  nomeMes: string;
  ano: number;
  /** dia da semana por extenso, ex.: "sábado" */
  diaSemana: string;
  hoje: boolean;
  total: number;
  concluidos: number;
  pendentes: number;
  percentual: number;
  itens: ItemResumoDia[];
}

export interface CalendarioCalculado {
  periodo: Periodo;
  mesAtual: boolean;
  habitos: HabitoCalendario[];
  colunas: ColunaDia[];
  progresso: ProgressoHabito[];
  diasElegiveis: number;
  totalConclusoes: number;
  resumo: ResumoDia | null;
}

export function resolverIcone(valor: string | null | undefined): IconeHabito {
  return (valor && MAPA_ICONES[valor]) || 'padrao';
}

export function chaveConclusao(data: string, habitoId: number): string {
  return `${data}|${habitoId}`;
}

/** mes de 1 a 12 → "yyyy-MM-dd" */
export function formatarDataIso(ano: number, mes: number, dia: number): string {
  return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

/** Data local (sem conversão para UTC) no formato yyyy-MM-dd. */
export function dataLocalIso(data: Date): string {
  return formatarDataIso(data.getFullYear(), data.getMonth() + 1, data.getDate());
}

/** mes de 1 a 12. `new Date(ano, mes, 0)` é o último dia do mês `mes`. */
export function diasNoMes(ano: number, mes: number): number {
  return new Date(ano, mes, 0).getDate();
}

export function periodoDe(data: Date): Periodo {
  return { ano: data.getFullYear(), mes: data.getMonth() + 1 };
}

export function compararPeriodos(a: Periodo, b: Periodo): number {
  return a.ano !== b.ano ? a.ano - b.ano : a.mes - b.mes;
}

export function periodoAnterior({ ano, mes }: Periodo): Periodo {
  return mes === 1 ? { ano: ano - 1, mes: 12 } : { ano, mes: mes - 1 };
}

export function proximoPeriodo({ ano, mes }: Periodo): Periodo {
  return mes === 12 ? { ano: ano + 1, mes: 1 } : { ano, mes: mes + 1 };
}

export function nomeDoMes(mes: number): string {
  return MESES[mes - 1];
}

/**
 * Dias que contam para o progresso: do dia 1 até hoje no mês atual,
 * o mês inteiro em meses passados e nenhum em meses futuros.
 */
export function calcularDiasElegiveis(periodo: Periodo, hoje: Date): number {
  const comparacao = compararPeriodos(periodo, periodoDe(hoje));
  if (comparacao > 0) return 0;
  if (comparacao === 0) return hoje.getDate();
  return diasNoMes(periodo.ano, periodo.mes);
}

export function percentual(parte: number, total: number): number {
  return total > 0 ? Math.round((parte / total) * 100) : 0;
}

export function montarCalendario(
  resposta: CalendarioMesResponse,
  hoje: Date,
  selecionado: string | null,
): CalendarioCalculado {
  const periodo: Periodo = { ano: resposta.ano, mes: resposta.mes };
  const hojeIso = dataLocalIso(hoje);
  const totalDias = diasNoMes(periodo.ano, periodo.mes);
  const diasElegiveis = calcularDiasElegiveis(periodo, hoje);
  const nomeMes = nomeDoMes(periodo.mes);

  const habitos: HabitoCalendario[] = resposta.habitos.map((h, indice) => {
    const cor = h.cor || CORES_PADRAO[indice % CORES_PADRAO.length];
    return {
      id: h.id,
      nome: h.nome,
      meta: h.meta ?? '',
      cor,
      destaque: corDeDestaque(cor),
      borda: corDeBorda(cor),
      icone: resolverIcone(h.icone),
    };
  });

  // Só conta conclusões de hábitos conhecidos, dentro do mês e até hoje.
  const idsHabitos = new Set(habitos.map((h) => h.id));
  const primeiroDia = formatarDataIso(periodo.ano, periodo.mes, 1);
  const ultimoDia = formatarDataIso(periodo.ano, periodo.mes, totalDias);
  const concluidas = new Set<string>();
  for (const c of resposta.conclusoes) {
    if (!idsHabitos.has(c.habitoId)) continue;
    if (c.data < primeiroDia || c.data > ultimoDia || c.data > hojeIso) continue;
    concluidas.add(chaveConclusao(c.data, c.habitoId));
  }

  const colunas: ColunaDia[] = [];
  for (let dia = 1; dia <= totalDias; dia++) {
    const data = formatarDataIso(periodo.ano, periodo.mes, dia);
    const futuro = data > hojeIso;
    colunas.push({
      data,
      dia,
      diaSemana: DIAS_SEMANA_CURTOS[new Date(periodo.ano, periodo.mes - 1, dia).getDay()],
      futuro,
      hoje: data === hojeIso,
      selecionado: data === selecionado,
      celulas: habitos.map((habito) => {
        const concluido = concluidas.has(chaveConclusao(data, habito.id));
        const estado = futuro ? 'data futura' : concluido ? 'concluído' : 'não concluído';
        return {
          habito,
          concluido,
          ariaLabel: `${habito.nome}, ${dia} de ${nomeMes}: ${estado}`,
        };
      }),
    });
  }

  const progresso: ProgressoHabito[] = habitos.map((habito) => {
    let concluidos = 0;
    for (const coluna of colunas) {
      if (concluidas.has(chaveConclusao(coluna.data, habito.id))) concluidos++;
    }
    return {
      habito,
      concluidos,
      elegiveis: diasElegiveis,
      percentual: percentual(concluidos, diasElegiveis),
    };
  });

  const colunaSelecionada = colunas.find((c) => c.selecionado && !c.futuro);

  return {
    periodo,
    mesAtual: compararPeriodos(periodo, periodoDe(hoje)) === 0,
    habitos,
    colunas,
    progresso,
    diasElegiveis,
    totalConclusoes: concluidas.size,
    resumo: colunaSelecionada ? resumoDoDia(colunaSelecionada) : null,
  };
}

export function resumoDoDia(coluna: ColunaDia): ResumoDia {
  const itens = coluna.celulas.map((c) => ({ habito: c.habito, concluido: c.concluido }));
  const total = itens.length;
  const concluidos = itens.filter((i) => i.concluido).length;
  const [ano, mes, dia] = coluna.data.split('-').map(Number);
  return {
    data: coluna.data,
    dia,
    nomeMes: nomeDoMes(mes),
    ano,
    diaSemana: DIAS_SEMANA_LONGOS[new Date(ano, mes - 1, dia).getDay()],
    hoje: coluna.hoje,
    total,
    concluidos,
    pendentes: total - concluidos,
    percentual: percentual(concluidos, total),
    itens,
  };
}
