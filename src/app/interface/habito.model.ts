import { User } from './user.model';

export interface Habito {
  id: number;
  usuario?: User;
  nome: string;
  meta: number;
  unidade?: string;
  icone?: string;
  cor?: string;
  icon?: string;
  color?: string;
  current?: number;
  concluidoHoje?: boolean;
  descricao?: string;
}

export interface CreateHabito {
  nome: string;
  meta: number;
  unidade: string;
  icone?: string;
  cor?: string;
}

export interface HabitoApiResponse {
  id: number;
  nome: string;
  icon: string;
  color: string;
}

export interface Usuario {
  nome: string;
  email: string;
  idade: number;
  nacionalidade: string;
}
