/**
 * Catálogo único de ícones de hábito.
 *
 * O campo `icon` do hábito passa a guardar uma chave simples (`water`, `book`…).
 * Hábitos antigos têm caminhos de arquivo (`assets/svg/icon-water.svg`) ou nomes de
 * ícone Material (`water_drop`, `translate`); `normalizarIcone` converte esses valores,
 * então eles continuam funcionando antes e depois da correção dos dados no banco.
 */

export type ChaveIcone =
  | 'water'
  | 'book'
  | 'workout'
  | 'code'
  | 'brain'
  | 'translate'
  | 'sleep'
  | 'walk';

export interface OpcaoIcone {
  chave: ChaveIcone;
  /** Rótulo acessível em pt-BR. */
  label: string;
  /** Ligadura da fonte "Material Icons" (clássica) carregada no index.html. */
  material: string;
}

/** Ordem em que as opções aparecem no seletor do modal. */
export const ICONES_HABITO: readonly OpcaoIcone[] = [
  { chave: 'water', label: 'Água', material: 'water_drop' },
  { chave: 'book', label: 'Leitura', material: 'menu_book' },
  { chave: 'workout', label: 'Exercício', material: 'fitness_center' },
  { chave: 'code', label: 'Programação', material: 'code' },
  { chave: 'brain', label: 'Aprendizado', material: 'psychology' },
  { chave: 'translate', label: 'Idiomas', material: 'translate' },
  { chave: 'sleep', label: 'Sono', material: 'bedtime' },
  // "footprint" só existe em Material Symbols; na fonte clássica aparece vazio.
  { chave: 'walk', label: 'Caminhada', material: 'directions_walk' },
];

export const ICONE_PADRAO: ChaveIcone = 'water';

/** Ícone Material exibido quando o valor salvo não é reconhecido. */
export const MATERIAL_DESCONHECIDO = 'track_changes';

/** Valores antigos (caminhos de asset e nomes Material) → chave nova. */
const VALORES_LEGADOS: Readonly<Record<string, ChaveIcone>> = {
  'assets/svg/icon-water.svg': 'water',
  water_drop: 'water',
  'assets/png/icon-study.png': 'book',
  menu_book: 'book',
  'assets/png/icon-workout.png': 'workout',
  fitness_center: 'workout',
  'assets/svg/icon-code.svg': 'code',
  psychology: 'brain',
  bedtime: 'sleep',
  footprint: 'walk',
};

const POR_CHAVE = new Map<string, OpcaoIcone>(ICONES_HABITO.map((i) => [i.chave, i]));

/**
 * Converte qualquer valor salvo (chave nova, caminho antigo ou nome Material antigo)
 * para a chave padrão. Devolve `null` se o valor não for reconhecido.
 */
export function normalizarIcone(valor: string | null | undefined): ChaveIcone | null {
  const v = valor?.trim();
  if (!v) return null;
  if (POR_CHAVE.has(v)) return v as ChaveIcone;
  return VALORES_LEGADOS[v] ?? null;
}

/** Ligadura Material para exibir o ícone de um valor salvo (novo ou antigo). */
export function iconeMaterial(valor: string | null | undefined): string {
  const chave = normalizarIcone(valor);
  return chave ? POR_CHAVE.get(chave)!.material : MATERIAL_DESCONHECIDO;
}
