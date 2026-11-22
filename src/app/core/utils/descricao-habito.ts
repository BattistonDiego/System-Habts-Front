/**
 * A descrição (meta) do hábito é salva como texto puro, ex.: "Ler 20 páginas".
 * O prefixo "Meta:" existe só na exibição.
 *
 * Alguns registros antigos foram salvos com o prefixo ("Meta: Estudar idiomas 1 vez");
 * `limparDescricao` remove esse prefixo para o formulário e a exibição não o duplicarem,
 * até os dados serem corrigidos no banco.
 */

const PREFIXO_META = /^\s*meta\s*:\s*/i;

/** Descrição sem o prefixo "Meta:" e sem espaços nas pontas. */
export function limparDescricao(descricao: string | null | undefined): string {
  return (descricao ?? '').replace(PREFIXO_META, '').trim();
}

/** Texto de exibição: "Meta: <descrição>", ou vazio quando não há descrição. */
export function textoMeta(descricao: string | null | undefined): string {
  const limpa = limparDescricao(descricao);
  return limpa ? `Meta: ${limpa}` : '';
}
