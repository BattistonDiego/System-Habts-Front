export interface Habito {
  id: number;
  nome: string;
  meta: number;
  unidade?: string;
  icone?: string;
  cor?: string;
  current?: number;
}

export interface CreateHabito {
  nome: string;
  meta: number;
  unidade: string;
  icone?: string;
  cor?: string;
}

export interface Usuario {
  nome: string;
  email: string;
  idade: number;
  nacionalidade: string;
}
