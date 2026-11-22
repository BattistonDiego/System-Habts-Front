import { User } from './user.model';

export interface Habito {
  id: number;
  usuario?: User;
  nome: string;
  /**
   * Contador interno da tela (sempre 1): NÃO é coluna do banco.
   * Mantido de propósito; a remoção é uma tarefa separada (junto com `current`).
   */
  meta: number;
  /** Chave do catálogo (core/utils/icone-habito) ou valor antigo ainda não convertido. */
  icon?: string;
  color?: string;
  current?: number;
  concluidoHoje?: boolean;
  /** Descrição pura ("Ler 20 páginas"); o prefixo "Meta:" é só de exibição. */
  descricao?: string;
}

/** Resposta de GET /habitos (HabitoResponse do backend). */
export interface HabitoApiResponse {
  id: number;
  nome: string;
  icon: string;
  color: string;
  descricao?: string | null;
}

export interface Usuario {
  nome: string;
  email: string;
  idade: number;
  nacionalidade: string;
}
