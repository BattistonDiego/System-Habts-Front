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
