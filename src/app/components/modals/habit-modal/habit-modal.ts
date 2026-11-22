import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Habito } from '../../../interface/habito.model';
import { COR_PRETA, corDeDestaque, isCorEscura } from '../../../core/utils/cor-habito';
import {
  ChaveIcone,
  ICONES_HABITO,
  ICONE_PADRAO,
  iconeMaterial,
  normalizarIcone,
} from '../../../core/utils/icone-habito';
import { limparDescricao } from '../../../core/utils/descricao-habito';

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
  readonly icons = ICONES_HABITO;
  readonly colors = [
    '#3B82F6',
    '#22C55E',
    '#FACC15',
    '#EF4444',
    '#A855F7',
    '#EC4899',
    '#06B6D4',
    '#94A3B8',
    COR_PRETA,
  ];

  readonly isCorEscura = isCorEscura;

  /** `icon` fica `null` quando o hábito editado tem um ícone que o catálogo não reconhece. */
  habitPreview: { name: string; icon: ChaveIcone | null; color: string; target: string } = {
    name: '',
    icon: ICONE_PADRAO,
    color: '#3B82F6',
    target: '',
  };
  habitoForm!: FormGroup;
  habito!: Habito;

  /** Valor de `icon` com que o hábito chegou; usado se o usuário salvar sem escolher outro. */
  private iconeOriginal: string | null = null;

  /** Cor da prévia (ícone, borda, tingimento): clara quando a cor escolhida é escura. */
  get corDestaque(): string {
    return corDeDestaque(this.habitPreview.color);
  }

  get iconName(): string {
    return iconeMaterial(this.habitPreview.icon ?? this.iconeOriginal);
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
      // Só a descrição pura: o prefixo "Meta:" é coisa da exibição.
      target: limparDescricao(this.habito.descricao),
    });
    // Valor antigo conhecido → já vem selecionado (e é salvo como chave nova).
    // Valor desconhecido → nenhum ícone selecionado; se salvar assim, o original é mantido.
    this.iconeOriginal = this.habito.icon ?? null;
    this.habitPreview.icon = normalizarIcone(this.habito.icon);
    this.habitPreview.color = this.habito.color || '#3B82F6';
  }

  selectIcon(icon: ChaveIcone) {
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
      icon: this.habitPreview.icon ?? this.iconeOriginal,
      color: this.habitPreview.color,
      habit: {
        nome: this.habitoForm.value.nome,
        descricao: limparDescricao(this.habitoForm.value.target),
      },
    });
  }
}
