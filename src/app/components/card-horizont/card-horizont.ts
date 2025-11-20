import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Habito } from '../../interface/habito.model';

@Component({
  selector: 'app-card-horizont',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule, CommonModule],
  templateUrl: './card-horizont.html',
  styleUrl: './card-horizont.scss',
})
export class CardHorizont {
  @Input() name: string = '';
  goal: number = 3;
  current: number = 0;
  @Input() icon!: string;
  @Input() description: string = '';

  @Input() index!: number;
  @Input() habito!: Habito;

  @Output() habitChanged = new EventEmitter<{ index: number; current: number }>();
  @Output() habitDelete = new EventEmitter<{ id: number }>();
  @Output() habitUpdate = new EventEmitter<number>();

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
}
