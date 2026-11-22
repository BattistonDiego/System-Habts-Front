import { limparDescricao, textoMeta } from './descricao-habito';

describe('descricao-habito', () => {
  describe('limparDescricao', () => {
    it('remove o prefixo "Meta:" salvo nos registros antigos', () => {
      expect(limparDescricao('Meta: Estudar Tecnologia 1 vez')).toBe('Estudar Tecnologia 1 vez');
      expect(limparDescricao('Meta: Estudar idiomas 1 vez')).toBe('Estudar idiomas 1 vez');
    });

    it('ignora maiúsculas/minúsculas e espaços em volta do prefixo', () => {
      expect(limparDescricao('  meta :  Ler 20 páginas ')).toBe('Ler 20 páginas');
      expect(limparDescricao('META:Correr')).toBe('Correr');
    });

    it('mantém a descrição pura e não mexe em "meta" no meio do texto', () => {
      expect(limparDescricao('Ler 20 páginas')).toBe('Ler 20 páginas');
      expect(limparDescricao('Bater a meta: 10 km')).toBe('Bater a meta: 10 km');
    });

    it('trata vazio, null e undefined', () => {
      expect(limparDescricao('')).toBe('');
      expect(limparDescricao(null)).toBe('');
      expect(limparDescricao(undefined)).toBe('');
    });
  });

  describe('textoMeta', () => {
    it('adiciona o prefixo só na exibição, sem duplicar', () => {
      expect(textoMeta('Ler 20 páginas')).toBe('Meta: Ler 20 páginas');
      expect(textoMeta('Meta: Estudar idiomas 1 vez')).toBe('Meta: Estudar idiomas 1 vez');
    });

    it('fica vazio quando não há descrição (nada de "Meta: undefined")', () => {
      expect(textoMeta(undefined)).toBe('');
      expect(textoMeta('Meta: ')).toBe('');
    });
  });
});
