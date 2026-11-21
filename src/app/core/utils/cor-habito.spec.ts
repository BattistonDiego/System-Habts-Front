import {
  COR_BORDA_ESCURA,
  COR_DESTAQUE_ESCURA,
  COR_PRETA,
  corDeBorda,
  corDeDestaque,
  isCorEscura,
  luminanciaRelativa,
} from './cor-habito';

/** Paleta do modal de hábito antes do preto: nenhuma delas pode ser tratada como escura. */
const PALETA_CLARA = [
  '#3B82F6',
  '#22C55E',
  '#FACC15',
  '#EF4444',
  '#A855F7',
  '#EC4899',
  '#06B6D4',
  '#94A3B8',
];

describe('cor-habito', () => {
  describe('isCorEscura', () => {
    it('considera o preto da paleta e variações escuras como escuras', () => {
      expect(isCorEscura(COR_PRETA)).toBeTrue();
      expect(isCorEscura('#0a0a0a')).toBeTrue();
      expect(isCorEscura('#000')).toBeTrue();
      expect(isCorEscura('#000000')).toBeTrue();
      expect(isCorEscura('#1e293b')).toBeTrue();
    });

    it('não considera nenhuma das outras cores da paleta como escura', () => {
      for (const cor of PALETA_CLARA) {
        expect(isCorEscura(cor)).withContext(cor).toBeFalse();
      }
    });

    it('não considera escura uma cor inválida ou ausente', () => {
      expect(isCorEscura('azul')).toBeFalse();
      expect(isCorEscura('')).toBeFalse();
      expect(isCorEscura(null)).toBeFalse();
      expect(isCorEscura(undefined)).toBeFalse();
    });
  });

  describe('corDeDestaque', () => {
    it('devolve um traço claro para cores escuras', () => {
      expect(corDeDestaque(COR_PRETA)).toBe(COR_DESTAQUE_ESCURA);
      expect(corDeDestaque('#000')).toBe('#e2e8f0');
    });

    it('devolve a própria cor quando ela não é escura', () => {
      expect(corDeDestaque('#3B82F6')).toBe('#3B82F6');
      expect(corDeDestaque('#94A3B8')).toBe('#94A3B8');
    });
  });

  describe('corDeBorda', () => {
    it('devolve uma borda clara sutil para cores escuras', () => {
      expect(corDeBorda(COR_PRETA)).toBe(COR_BORDA_ESCURA);
      expect(corDeBorda(COR_PRETA)).toBe('#475569');
    });

    it('devolve a própria cor quando ela não é escura', () => {
      expect(corDeBorda('#22C55E')).toBe('#22C55E');
    });
  });

  it('luminanciaRelativa segue a fórmula WCAG e aceita #rgb', () => {
    expect(luminanciaRelativa('#000000')).toBe(0);
    expect(luminanciaRelativa('#ffffff')).toBeCloseTo(1, 5);
    expect(luminanciaRelativa('#fff')).toBeCloseTo(1, 5);
    expect(luminanciaRelativa('rgb(0,0,0)')).toBeNull();
  });
});
