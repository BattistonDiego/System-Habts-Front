import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Habito } from '../../interface/habito.model';
import { HistoricoService } from '../../service/historico.service';
import { HistoricoEstatistica } from '../../interface/historico.model';

@Component({
  selector: 'app-card-horizont',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule, CommonModule],
  templateUrl: './card-horizont.html',
  styleUrl: './card-horizont.scss',
})
export class CardHorizont {
  @Input() name: string = '';
  @Input() current: number = 0;
  @Input() icon!: string;
  @Input() description: string = '';

  @Input() index!: number;
  @Input() habito!: Habito;
  @Input() habitoCompleted!: boolean | undefined;

  @Output() habitChanged = new EventEmitter<{ index: number; current: number }>();
  @Output() habitDelete = new EventEmitter<{ id: number }>();
  @Output() habitUpdate = new EventEmitter<number>();

  mensagemConcluidoHoje: string | null = null;
  estatisticaHistorico!: HistoricoEstatistica;
  showStats = false;

  constructor(private historicoService: HistoricoService) {}

  get isCompleted(): boolean {
    return this.habito?.concluidoHoje === true;
  }

  get habitColor(): string {
    return this.habito?.color || this.habito?.cor || '#3b82f6';
  }

  get iconName(): string {
    return this.legacyIconNames[this.iconValue] ?? (this.iconValue || 'water_drop');
  }

  get isImageIcon(): boolean {
    const icon = this.habito?.icone ?? this.habito?.icon ?? '';
    const isAsset = /^(assets\/|https?:\/\/|data:image\/)/i.test(icon);
    return isAsset && !Object.hasOwn(this.legacyIconNames, icon);
  }

  private readonly legacyIconNames: Record<string, string> = {
    'assets/svg/icon-water.svg': 'water_drop',
    'assets/png/icon-study.png': 'menu_book',
    'assets/png/icon-workout.png': 'fitness_center',
    'assets/svg/icon-code.svg': 'code',
  };

  get iconValue(): string {
    return this.habito?.icone ?? this.habito?.icon ?? '';
  }

  getHabitDisplayMeta(habit: Habito): string {
    return `Meta: ${habit.nome}`;
  }

  completeHabit() {
    if (!this.isCompleted) {
      this.current = this.habito.meta;
      this.habitChanged.emit({ index: this.index, current: this.current });
    }
  }

  increase() {
    if (this.current < this.habito.meta) {
      this.current++;
      this.habitChanged.emit({ index: this.index, current: this.current });
    }
  }

  decrease() {
    if (this.current > 0) {
      this.current--;
      this.habitChanged.emit({ index: this.index, current: this.current });
    }
  }

  deleteHabit(idHabit: number) {
    this.habitDelete.emit({ id: idHabit });
  }

  updateHabit(idHabit: number) {
    // ver com o chat se é aqui mesmo se eu devo abrir 0 modal para editar ou se é no componente pai
    this.habitUpdate.emit(idHabit);
  }

  get progress(): number {
    return (this.current / this.habito.meta) * 100;
  }

  onMouseEnter() {
    this.showStats = !this.showStats;

    if (this.showStats) {
      this.historicoService.getEstatisticas(this.habito.id).subscribe({
        next: (data) => {
          this.estatisticaHistorico = data;
        },
        error: () => {},
      });
    }
  }

  closeStats() {
    this.showStats = false;
  }
}
