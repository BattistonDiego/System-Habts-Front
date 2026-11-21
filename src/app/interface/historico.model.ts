export interface HistoricoRegistro {
  id: number;
  habitoId: number;
  data: string;
  concluido: boolean;
}

export interface HistoricoEstatistica {
  sequenciaAtual: number;
  melhorSequencia: number;
  taxaConclusao: string;
  inicio: string;
  totalRegistro: number;
}

/** Resposta de GET /historico/mes?ano=&mes= (mes de 1 a 12). */
export interface CalendarioMesResponse {
  ano: number;
  mes: number;
  habitos: HabitoMes[];
  conclusoes: ConclusaoMes[];
}

export interface HabitoMes {
  id: number;
  nome: string;
  meta: string | null;
  cor: string | null;
  icone: string | null;
}

export interface ConclusaoMes {
  habitoId: number;
  /** yyyy-MM-dd */
  data: string;
}
