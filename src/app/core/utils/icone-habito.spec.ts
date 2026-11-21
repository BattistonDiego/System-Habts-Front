import {
  ICONES_HABITO,
  ICONE_PADRAO,
  MATERIAL_DESCONHECIDO,
  iconeMaterial,
  normalizarIcone,
} from './icone-habito';

describe('icone-habito', () => {
  it('tem as 8 chaves aprovadas, na ordem do seletor', () => {
    expect(ICONES_HABITO.map((i) => i.chave)).toEqual([
      'water',
      'book',
      'workout',
      'code',
      'brain',
      'translate',
      'sleep',
      'walk',
    ]);
    expect(ICONE_PADRAO).toBe('water');
  });

  it('Caminhada usa uma ligadura que existe na fonte Material Icons clássica', () => {
    const caminhada = ICONES_HABITO.find((i) => i.chave === 'walk')!;
    expect(caminhada.label).toBe('Caminhada');
    expect(caminhada.material).toBe('directions_walk');
    expect(caminhada.material).not.toBe('footprint');
  });

  describe('normalizarIcone', () => {
    it('mantém as chaves novas', () => {
      for (const { chave } of ICONES_HABITO) {
        expect(normalizarIcone(chave)).withContext(chave).toBe(chave);
      }
    });

    it('converte os caminhos de arquivo antigos', () => {
      expect(normalizarIcone('assets/svg/icon-water.svg')).toBe('water');
      expect(normalizarIcone('assets/png/icon-study.png')).toBe('book');
      expect(normalizarIcone('assets/png/icon-workout.png')).toBe('workout');
      expect(normalizarIcone('assets/svg/icon-code.svg')).toBe('code');
    });

    it('converte os nomes Material antigos', () => {
      expect(normalizarIcone('water_drop')).toBe('water');
      expect(normalizarIcone('menu_book')).toBe('book');
      expect(normalizarIcone('fitness_center')).toBe('workout');
      expect(normalizarIcone('psychology')).toBe('brain');
      expect(normalizarIcone('translate')).toBe('translate');
      expect(normalizarIcone('bedtime')).toBe('sleep');
      expect(normalizarIcone('footprint')).toBe('walk');
    });

    it('devolve null para valores desconhecidos ou vazios', () => {
      expect(normalizarIcone('💧')).toBeNull();
      expect(normalizarIcone('assets/png/outro.png')).toBeNull();
      expect(normalizarIcone('')).toBeNull();
      expect(normalizarIcone(null)).toBeNull();
      expect(normalizarIcone(undefined)).toBeNull();
    });
  });

  describe('iconeMaterial', () => {
    it('resolve chaves novas e valores antigos para a ligadura Material', () => {
      expect(iconeMaterial('walk')).toBe('directions_walk');
      expect(iconeMaterial('footprint')).toBe('directions_walk');
      expect(iconeMaterial('assets/png/icon-study.png')).toBe('menu_book');
      expect(iconeMaterial('translate')).toBe('translate');
    });

    it('usa um ícone genérico para valores desconhecidos', () => {
      expect(iconeMaterial('qualquer-coisa')).toBe(MATERIAL_DESCONHECIDO);
      expect(iconeMaterial(null)).toBe(MATERIAL_DESCONHECIDO);
    });
  });
});
