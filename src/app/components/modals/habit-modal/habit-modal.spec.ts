import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitModal } from './habit-modal';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COR_PRETA } from '../../../core/utils/cor-habito';

describe('HabitModal', () => {
  let component: HabitModal;
  let fixture: ComponentFixture<HabitModal>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<HabitModal>>;
  let el: HTMLElement;

  const swatches = () => Array.from(el.querySelectorAll<HTMLButtonElement>('.color-choice'));
  const swatchPreto = () => swatches().find((b) => b.getAttribute('aria-label')?.endsWith(COR_PRETA))!;
  const iconeSelecionado = () =>
    el.querySelector<HTMLButtonElement>('.icon-choice.selected')?.getAttribute('aria-label');

  async function criar(data: unknown = {}) {
    dialogRef = jasmine.createSpyObj<MatDialogRef<HabitModal>>('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [HabitModal],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitModal);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  }

  describe('criação', () => {
    beforeEach(() => criar());

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('mostra o preto como última opção, depois do cinza, sem alterar as demais', () => {
      expect(component.colors).toEqual([
        '#3B82F6',
        '#22C55E',
        '#FACC15',
        '#EF4444',
        '#A855F7',
        '#EC4899',
        '#06B6D4',
        '#94A3B8',
        '#0A0A0A',
      ]);
      const botoes = swatches();
      expect(botoes.length).toBe(9);
      expect(botoes[8].getAttribute('aria-label')).toBe('Selecionar cor #0A0A0A');
    });

    it('marca só a bolinha preta como escura (borda clara)', () => {
      const escuras = swatches().filter((b) => b.classList.contains('escura'));
      expect(escuras).toEqual([swatchPreto()]);
      expect(getComputedStyle(swatchPreto()).borderTopColor).toBe('rgb(71, 85, 105)'); // #475569
    });

    it('permite selecionar o preto, com check branco', () => {
      swatchPreto().click();
      fixture.detectChanges();

      expect(component.habitPreview.color).toBe(COR_PRETA);
      expect(swatchPreto().getAttribute('aria-pressed')).toBe('true');
      expect(swatchPreto().classList).toContain('selected');
      const check = swatchPreto().querySelector('mat-icon');
      expect(check?.textContent?.trim()).toBe('check');
      expect(getComputedStyle(check!).color).toBe('rgb(255, 255, 255)');
    });

    it('usa um destaque claro na prévia quando o preto está selecionado', () => {
      swatchPreto().click();
      fixture.detectChanges();

      expect(component.corDestaque).toBe('#e2e8f0');
      const preview = el.querySelector<HTMLElement>('.preview-icon')!;
      expect(preview.style.color).toBe('rgb(226, 232, 240)');
    });

    it('envia o preto ao salvar', () => {
      component.habitoForm.setValue({ nome: 'Meditar', target: '10 minutos' });
      swatchPreto().click();

      component.addHabit();

      expect(dialogRef.close).toHaveBeenCalledWith(
        jasmine.objectContaining({ color: COR_PRETA, habit: jasmine.objectContaining({ nome: 'Meditar' }) }),
      );
    });
  });

  describe('edição', () => {
    it('abre com o preto selecionado quando o hábito é preto', async () => {
      await criar({
        mode: 'edit',
        habitSelected: { id: 1, nome: 'Meditar', meta: 1, color: COR_PRETA, icon: 'psychology' },
      });

      expect(el.querySelector('h2')?.textContent).toContain('Editar hábito');
      expect(swatchPreto().getAttribute('aria-pressed')).toBe('true');
    });

    const campoMeta = () => el.querySelector<HTMLInputElement>('#habit-target')!;

    it('o campo Meta mostra a descrição salva, sem prefixo e sem "1 vez"', async () => {
      await criar({
        mode: 'edit',
        habitSelected: { id: 1, nome: 'Meditar', meta: 1, descricao: 'Meditar 10 minutos', icon: 'brain' },
      });

      expect(campoMeta().value).toBe('Meditar 10 minutos');
      expect(campoMeta().value).not.toContain('Meta:');
    });

    it('registro antigo com "Meta:" salvo: o campo mostra e salva só a descrição pura', async () => {
      await criar({
        mode: 'edit',
        habitSelected: { id: 2, nome: 'Idiomas', meta: 1, descricao: 'Meta: Estudar idiomas 1 vez', icon: 'translate' },
      });

      expect(campoMeta().value).toBe('Estudar idiomas 1 vez');

      component.addHabit();
      expect(dialogRef.close).toHaveBeenCalledWith(
        jasmine.objectContaining({ habit: jasmine.objectContaining({ descricao: 'Estudar idiomas 1 vez' }) }),
      );
    });

    it('não salva o prefixo mesmo se o usuário digitar "Meta:"', async () => {
      await criar();
      component.habitoForm.setValue({ nome: 'Ler', target: 'Meta: Ler 20 páginas' });

      component.addHabit();

      expect(dialogRef.close).toHaveBeenCalledWith(
        jasmine.objectContaining({ habit: jasmine.objectContaining({ descricao: 'Ler 20 páginas' }) }),
      );
    });

    it('ícone antigo (caminho de arquivo) abre selecionado e é salvo como chave nova', async () => {
      await criar({
        mode: 'edit',
        habitSelected: { id: 3, nome: 'Estudar Java', meta: 1, descricao: 'Estudar', icon: 'assets/svg/icon-code.svg' },
      });

      expect(iconeSelecionado()).toBe('Programação');
      component.addHabit();
      expect(dialogRef.close).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'code' }));
    });

    describe('ícone desconhecido', () => {
      const habitoComIconeEstranho = {
        id: 4,
        nome: 'Correr',
        meta: 1,
        descricao: '5 km',
        icon: 'assets/png/icone-que-nao-existe.png',
      };

      it('não pré-seleciona nenhum ícone (nem "Água")', async () => {
        await criar({ mode: 'edit', habitSelected: habitoComIconeEstranho });

        expect(component.habitPreview.icon).toBeNull();
        expect(el.querySelectorAll('.icon-choice.selected').length).toBe(0);
        expect(el.querySelectorAll('.icon-choice[aria-pressed="true"]').length).toBe(0);
      });

      it('salvar sem escolher mantém o valor original do icon', async () => {
        await criar({ mode: 'edit', habitSelected: habitoComIconeEstranho });

        component.addHabit();

        expect(dialogRef.close).toHaveBeenCalledWith(
          jasmine.objectContaining({ icon: 'assets/png/icone-que-nao-existe.png' }),
        );
      });

      it('escolher um ícone substitui o original pela chave nova', async () => {
        await criar({ mode: 'edit', habitSelected: habitoComIconeEstranho });

        el.querySelector<HTMLButtonElement>('.icon-choice[aria-label="Caminhada"]')!.click();
        fixture.detectChanges();
        component.addHabit();

        expect(iconeSelecionado()).toBe('Caminhada');
        expect(dialogRef.close).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'walk' }));
      });

      it('a prévia usa o ícone genérico, sem quebrar', async () => {
        await criar({ mode: 'edit', habitSelected: habitoComIconeEstranho });

        expect(el.querySelector('.preview-icon mat-icon')?.textContent?.trim()).toBe('track_changes');
      });
    });
  });

  describe('seletor de ícones', () => {
    beforeEach(() => criar());

    it('mostra as 8 opções com ligaduras da fonte clássica (Caminhada não fica vazia)', () => {
      const botoes = Array.from(el.querySelectorAll<HTMLButtonElement>('.icon-choice'));
      expect(botoes.map((b) => b.querySelector('mat-icon')?.textContent?.trim())).toEqual([
        'water_drop',
        'menu_book',
        'fitness_center',
        'code',
        'psychology',
        'translate',
        'bedtime',
        'directions_walk',
      ]);
      expect(botoes[7].getAttribute('aria-label')).toBe('Caminhada');
    });

    it('selecionar Caminhada salva a chave "walk"', () => {
      el.querySelector<HTMLButtonElement>('.icon-choice[aria-label="Caminhada"]')!.click();
      fixture.detectChanges();

      expect(iconeSelecionado()).toBe('Caminhada');
      component.addHabit();
      expect(dialogRef.close).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'walk' }));
    });

    it('hábito novo começa com o ícone padrão "water"', () => {
      expect(component.habitPreview.icon).toBe('water');
      expect(iconeSelecionado()).toBe('Água');
    });
  });
});
