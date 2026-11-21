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
  });
});
