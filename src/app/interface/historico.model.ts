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
