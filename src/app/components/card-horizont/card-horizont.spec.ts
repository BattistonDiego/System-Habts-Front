import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHorizont } from './card-horizont';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CardHorizont', () => {
  let component: CardHorizont;
  let fixture: ComponentFixture<CardHorizont>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHorizont],
      providers: [provideHttpClient(withFetch()), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CardHorizont);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.habito = {
      id: 1,
      nome: 'Beber água',
      color: '#2196F3',
      meta: 2000,
      icon: 'water_drop',
      current: 0,
      concluidoHoje: false,
      usuario: {
        id: 1,
        nome: 'Diego',
        email: 'diego@email.com',
        telefone: '11999999999',
        senha: '123456',
        perfil: 'ADMIN',
        status: 'ATIVO',
      },
      // resto dos campos obrigatórios
    };
    fixture.detectChanges(); // agora sim
    expect(component).toBeTruthy();
  });

  it('hábito preto: mantém o preenchimento preto e usa destaque/borda claros', () => {
    component.habito = {
      id: 2,
      nome: 'Meditar',
      color: '#0A0A0A',
      meta: 1,
      icon: 'psychology',
      concluidoHoje: true,
    };
    fixture.detectChanges();

    const card = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.habit-card')!;
    expect(card.style.getPropertyValue('--habit-color')).toBe('#0A0A0A');
    expect(card.style.getPropertyValue('--habit-accent')).toBe('#e2e8f0');
    expect(card.style.getPropertyValue('--habit-border')).toBe('#475569');

    const check = card.querySelector<HTMLElement>('.completion-check.checked')!;
    expect(getComputedStyle(check).borderTopColor).toBe('rgb(71, 85, 105)');
    expect(getComputedStyle(card.querySelector('.habit-icon')!).color).toBe('rgb(226, 232, 240)');
  });

  it('hábito com cor clara: destaque e borda iguais à própria cor', () => {
    component.habito = { id: 3, nome: 'Ler', color: '#22C55E', meta: 1, icon: 'menu_book' };
    expect(component.habitAccent).toBe('#22C55E');
    expect(component.habitBorder).toBe('#22C55E');
  });

  describe('Meta e ícone', () => {
    const texto = (sel: string) =>
      (fixture.nativeElement as HTMLElement).querySelector(sel)?.textContent?.trim();

    function renderizar(parcial: Partial<CardHorizont['habito']>) {
      component.habito = { id: 9, nome: 'Hábito', meta: 1, color: '#3B82F6', ...parcial };
      fixture.detectChanges();
    }

    it('mostra "Meta: <descrição>" uma vez só', () => {
      renderizar({ descricao: 'Ler 20 páginas' });
      expect(texto('.meta')).toBe('Meta: Ler 20 páginas');
    });

    it('registro antigo com prefixo salvo não vira "Meta: Meta: …"', () => {
      renderizar({ descricao: 'Meta: Estudar Tecnologia 1 vez' });
      expect(texto('.meta')).toBe('Meta: Estudar Tecnologia 1 vez');
    });

    it('sem descrição, não mostra "Meta: undefined"', () => {
      renderizar({ descricao: undefined });
      expect((fixture.nativeElement as HTMLElement).querySelector('.meta')).toBeNull();
    });

    it('resolve ícones antigos e novos para a ligadura Material', () => {
      renderizar({ icon: 'assets/png/icon-study.png' });
      expect(texto('.habit-icon mat-icon')).toBe('menu_book');

      component.habito = { ...component.habito, icon: 'walk' };
      fixture.detectChanges();
      expect(texto('.habit-icon mat-icon')).toBe('directions_walk');
    });
  });
});
