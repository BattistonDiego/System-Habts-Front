import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';
import { CardHorizont } from '../../components/card-horizont/card-horizont';
import { History } from '../../components/history/history';
import { MatDialog } from '@angular/material/dialog';
import { HabitModal } from '../../components/habit-modal/habit-modal';
import { HabitoService } from '../../service/habito.service';
import { CreateHabito, Habito } from '../../interface/habito.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomSnackbar } from '../../components/custom-snackbar/custom-snackbar';
import { DeleteHabitoModal } from '../../components/delete-habito-modal/delete-habito-modal';

@Component({
  selector: 'app-habts-page',
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule,
    Card,
    CardHorizont,
    History,
    MatSnackBarModule,
  ],
  templateUrl: './habts-page.html',
  styleUrl: './habts-page.scss',
})
export class HabtsPage implements OnInit {
  selectedDate = new Date();
  completedHabitsCount = 0;
  progress = 0;
  restante = 100;
  showHistoryFlag = false;

  constructor(
    private dialog: MatDialog,
    private habitoService: HabitoService,
    private snackBar: MatSnackBar
  ) {}

  listCards: any[] = [];
  totalHabitos: number = 0;
  listHabitos: Habito[] = [];

  ngOnInit() {
    this.loadHabitos();
  }

  loadHabitos() {
    this.habitoService.getHabitos().subscribe((habitos) => {
      this.listHabitos = habitos.map((h) => ({
        ...h,
        current: 0,
      }));
      this.totalHabitos = habitos.length;
      this.updatesCards();
    });
  }

  addHabit(habit: Habito) {
    this.habitoService.postHabitos(habit).subscribe({
      next: () => {
        this.snackBar.openFromComponent(CustomSnackbar, {
          data: {
            message: 'Hábito adicionado com sucesso!',
            icon: 'check_circle',
          },
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });

        this.loadHabitos();
      },
      error: () => {
        this.snackBar.openFromComponent(CustomSnackbar, {
          data: {
            message: 'Hábito adicionado com sucesso!',
            icon: 'check_circle',
          },
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  deleteHabit(event: { id: number }) {
    const dialogRef = this.dialog.open(DeleteHabitoModal, {
      data: {},
    });
    // this.habitoService.deleteHabitos(event.id).subscribe({
    //   next: () => {
    //     this.snackBar.open('Hábito Deletado com sucesso!', '', {
    //       duration: 3000,
    //       horizontalPosition: 'center',
    //       verticalPosition: 'top',
    //       panelClass: ['snackbar-error'],
    //     });
    //     this.loadHabitos();
    //   },
    // });
  }

  updateHabit(id: number) {
    const habitoSelected = this.listHabitos.filter((h) => h.id === id);
    const dialogRef = this.dialog.open(HabitModal, {
      data: {
        habitSelected: habitoSelected[0],
        mode: 'edit',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const body = {
          nome: result.habit.nome,
          meta: result.habit.meta,
          unidade: result.habit.unidade,
          icone: result.icon,
          cor: result.color,
        };
        this.habitoService.editHabitos(habitoSelected[0].id, body).subscribe({
          next: () => {
            this.snackBar.openFromComponent(CustomSnackbar, {
              data: {
                message: 'Hábito alterado com sucesso!',
                icon: 'check_circle',
              },
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-success'],
            });
            this.loadHabitos();
          },
        });
      }
    });
  }

  updatesCards() {
    this.listCards = [
      {
        description: 'Progresso',
        complement: this.progress + '%',
        icon: 'assets/png/icon-progress.png',
      },
      {
        description: 'Hábitos Completos',
        complement: '0/' + this.totalHabitos,
        icon: 'assets/png/icon-complete.png',
      },
      { description: 'Sequência', complement: '3 Dias', icon: 'assets/png/icon-sequence.png' },
    ];
  }

  changeDate(days: number) {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(this.selectedDate.getDate() + days);
    this.selectedDate = newDate;
  }

  goToToday() {
    this.selectedDate = new Date();
  }

  showHistory() {
    this.showHistoryFlag = !this.showHistoryFlag;
  }

  onHabitChanged(event: { index: number; current: number }) {
    this.listHabitos[event.index].current = event.current;
    console.log(this.listHabitos[event.index]);
    this.recalculateProgress();
  }

  recalculateProgress() {
    const completed = this.listHabitos.filter((h) => h.current! >= h.meta).length;
    this.completedHabitsCount = completed;

    const progress = Math.round((completed / this.listHabitos.length) * 100);

    const progressCard = this.listCards.find((c) => c.description === 'Progresso');
    if (progressCard) progressCard.complement = `${progress}%`;

    const habitsCard = this.listCards.find((c) => c.description === 'Hábitos Completos');
    if (habitsCard) habitsCard.complement = `${completed}/${this.listHabitos.length}`;

    this.restante = 100 - progress;
  }

  openAddHabitModal() {
    const dialogRef = this.dialog.open(HabitModal, {
      data: {
        // You can pass data to the modal here if needed
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newHabit: Habito = {
          id: result.habit.id,
          nome: result.habit.nome,
          meta: result.habit.meta,
          unidade: result.habit.unidade,
          icone: result.icon,
          cor: result.color,
        };
        this.addHabit(newHabit);
      }
    });
  }
}
