/**
 * Utilitários para manter a cor do hábito legível no tema escuro.
 *
 * Regra de uso:
 * - preenchimento sólido (quadrado concluído, botão marcado, bolinha): use a cor do hábito
 *   e `corDeBorda()` na borda;
 * - destaque (ícone, tingimento, anel, faixa, borda de hover): use `corDeDestaque()`.
 * Para cores que não são escuras, as duas funções devolvem a própria cor.
 */

/** Preto da paleta: um pouco acima de #000 para combinar com o tema escuro. */
export const COR_PRETA = '#0A0A0A';

/** Destaque usado no lugar de uma cor escura (traço, ícone, tingimento). */
export const COR_DESTAQUE_ESCURA = '#e2e8f0';

/** Borda sutil para preenchimentos escuros não sumirem no fundo. */
export const COR_BORDA_ESCURA = '#475569';

/**
 * Abaixo desta luminância relativa (WCAG) a cor se confunde com os fundos do app
 * (#0b1020 a #1e293b). As cores da paleta ficam todas acima de 0.18; o preto, em ~0.003.
 */
const LIMITE_LUMINANCIA = 0.05;

/** Luminância relativa (WCAG 2.x) de uma cor #rgb ou #rrggbb; `null` se não for hex válido. */
export function luminanciaRelativa(cor: string | null | undefined): number | null {
  const hex = cor?.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1];
  if (!hex) return null;

  const completo = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const canal = parseInt(completo.slice(i, i + 2), 16) / 255;
    return canal <= 0.03928 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** `true` para cores que ficariam invisíveis sobre o fundo escuro (ex.: preto). */
export function isCorEscura(cor: string | null | undefined): boolean {
  const luminancia = luminanciaRelativa(cor);
  return luminancia !== null && luminancia < LIMITE_LUMINANCIA;
}

/** Cor para traços, ícones e tingimentos: a própria cor ou um tom claro se ela for escura. */
export function corDeDestaque(cor: string): string {
  return isCorEscura(cor) ? COR_DESTAQUE_ESCURA : cor;
}

/** Borda para preenchimentos sólidos: a própria cor ou uma borda clara sutil se ela for escura. */
export function corDeBorda(cor: string): string {
  return isCorEscura(cor) ? COR_BORDA_ESCURA : cor;
}
