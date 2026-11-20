import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Habito } from '../../../interface/habito.model';

@Component({
  selector: 'app-add-habit-modal',
  standalone: true,
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
  readonly icons = [
    { name: 'water_drop', label: 'Água', value: 'assets/svg/icon-water.svg' },
    { name: 'menu_book', label: 'Leitura', value: 'assets/png/icon-study.png' },
    { name: 'fitness_center', label: 'Exercício', value: 'assets/png/icon-workout.png' },
    { name: 'code', label: 'Programação', value: 'assets/svg/icon-code.svg' },
    { name: 'psychology', label: 'Aprendizado', value: 'psychology' },
    { name: 'translate', label: 'Idiomas', value: 'translate' },
    { name: 'bedtime', label: 'Sono', value: 'bedtime' },
    { name: 'footprint', label: 'Caminhada', value: 'footprint' },
  ];
  readonly colors = [
    '#3B82F6',
    '#22C55E',
    '#FACC15',
    '#EF4444',
    '#A855F7',
    '#EC4899',
    '#06B6D4',
    '#94A3B8',
  ];

  habitPreview = { name: '', icon: 'assets/svg/icon-water.svg', color: '#3B82F6', target: '' };
  habitoForm!: FormGroup;
  habito!: Habito;

  get iconName(): string {
    return this.icons.find((icon) => icon.value === this.habitPreview.icon)?.name ?? 'water_drop';
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<HabitModal>,
  ) {}

  ngOnInit() {
    this.habitoForm = this.fb.group({
      nome: ['', Validators.required],
      target: [''],
    });

    this.habitoForm.valueChanges.subscribe(({ nome, target }) => {
      this.habitPreview.name = nome ?? '';
      this.habitPreview.target = target ?? '';
    });

    if (this.data?.mode === 'edit') {
      this.habito = this.data.habitSelected;
      this.loadForm();
    }
  }

  loadForm() {
    this.habitoForm.patchValue({
      nome: this.habito.nome,
      target: `Meta: ${this.habito.nome} ${this.habito.meta} ${this.habito.unidade ?? ''}`.trim(),
    });
    this.habitPreview.icon = this.habito.icon || this.habito.icone || 'assets/svg/icon-water.svg';
    this.habitPreview.color = this.habito.color || this.habito.cor || '#3B82F6';
  }

  selectIcon(icon: string) {
    this.habitPreview.icon = icon;
  }

  selectColor(color: string) {
    this.habitPreview.color = color;
  }

  close() {
    this.dialogRef.close();
  }

  addHabit() {
    this.dialogRef.close({
      icon: this.habitPreview.icon,
      color: this.habitPreview.color,
      habit: { nome: this.habitoForm.value.nome, descricao: this.habitoForm.value.target },
    });
  }
}
