import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CreateHabito, Habito } from '../../interface/habito.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-habit-modal',
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './habit-modal.html',
  styleUrl: './habit-modal.scss',
})
export class HabitModal implements OnInit {
  selectedIcon: string | undefined = '';
  selectedColor: string | undefined = '';

  icons = [
    { name: 'water_drop', label: 'Água', src: 'assets/svg/icon-water.svg' },
    { name: 'menu_book', label: 'Livro', src: 'assets/png/icon-study.png' },
    { name: 'fitness_center', label: 'Exercício', src: 'assets/png/icon-workout.png' },
    { name: 'code', label: 'Codar', src: 'assets/svg/icon-code.svg' },
  ];

  colors = ['#4A90E2', '#F7D154', '#F55E5E', '#53D86A', '#B55EFF', '#FF5AAA', '#000000'];

  habitoForm!: FormGroup;
  habito!: Habito;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<HabitModal>
  ) {}

  ngOnInit() {
    this.habitoForm = this.fb.group({
      nome: ['', Validators.required],
      meta: [0, [Validators.required, Validators.min(1)]],
      unidade: ['', Validators.required],
    });

    if (this.data.mode === 'edit') {
      this.habito = this.data.habitSelected;
      this.loadForm();
    }
  }

  loadForm() {
    this.habitoForm.patchValue({
      nome: this.habito.nome,
      meta: this.habito.meta,
      unidade: this.habito.unidade,
    });

    this.selectedIcon = this.habito.icone;
    this.selectedColor = this.habito.cor;
  }

  close() {
    this.dialogRef.close();
  }

  addHabit() {
    this.dialogRef.close({
      icon: this.selectedIcon,
      color: this.selectedColor,
      habit: this.habitoForm.value,
    });
  }
}
