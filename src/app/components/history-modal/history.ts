import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HistoricoService } from '../../service/historico.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbar } from '../custom-snackbar/custom-snackbar';

@Component({
  selector: 'app-history',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressBarModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],

  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History {
  constructor(
    private dialogRef: MatDialogRef<History>,
    private historicoService: HistoricoService,
    private snackBar: MatSnackBar
  ) {}

  listHistorico: any[] = [];
  showList: boolean = false;

  dataSelecionada = new FormControl<Date | null>(null);

  close() {
    this.dialogRef.close();
  }

  clear() {
    this.dataSelecionada.setValue(null);
    this.showList = false;
  }

  filter() {
    const valor = this.dataSelecionada.value;
    if (!valor) {
      console.warn('Nenhuma data selecionada!');
      return;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataSelecionada = new Date(valor);
    dataSelecionada.setHours(0, 0, 0, 0);

    if (dataSelecionada > hoje) {
      this.snackBar.openFromComponent(CustomSnackbar, {
        data: {
          message: 'Não é possível usar essa data!',
          icon: 'error_outline',
        },
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-error'],
      });
      return;
    }

    const data = this.dataSelecionada.value!.toISOString().split('T')[0];

    this.historicoService.getListHistoricoByDate(data).subscribe({
      next: (res) => {
        this.listHistorico = res;

        this.showList = this.listHistorico.length > 0;
      },
    });
  }
}
