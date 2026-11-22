import { Component, OnInit } from '@angular/core';
import { Habito } from '../../interface/habito.model';
import { RouterLink } from '@angular/router';
import { Card } from '../../components/card/card';
import { CommonModule } from '@angular/common';
import { HistoricoService } from '../../service/historico.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { User } from '../../interface/user.model';
import { HabitoService } from '../../service/habito.service';
import { LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { Zap, Target, Award } from 'lucide-angular';
import { CalendarioHabitosComponent } from '../../components/calendario-habitos/calendario-habitos';

/**
 * Eixo do gráfico "Hábitos por dia". A `chave` é o nome em inglês que o backend devolve
 * (TO_CHAR(data, 'Day') no Postgres) e precisa continuar igual; o `rotulo` é o que aparece.
 */
export const DIAS_GRAFICO_SEMANAL = [
  { chave: 'Monday', rotulo: 'Seg' },
  { chave: 'Tuesday', rotulo: 'Ter' },
  { chave: 'Wednesday', rotulo: 'Qua' },
  { chave: 'Thursday', rotulo: 'Qui' },
  { chave: 'Friday', rotulo: 'Sex' },
  { chave: 'Saturday', rotulo: 'Sáb' },
  { chave: 'Sunday', rotulo: 'Dom' },
] as const;

@Component({
  selector: 'app-dashboard-page',
  imports: [
    RouterLink,
    Card,
    CommonModule,
    BaseChartDirective,
    LucideAngularModule,
    CalendarioHabitosComponent,
  ],
  providers: [
    {
      provide: LUCIDE_ICONS,
      useValue: new LucideIconProvider({ Zap, Target, Award }),
      multi: true,
    },
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  usuario!: User;

  progress = 0;
  quantidadeHabitos = 0;
  habitoscount = 0;
  bestSequencia: number = 0;
  qntdEsteMes: number = 0;
  mediaHabitosCompletados: number = 0;
  streak: number = 0;

  totalHabitos: number = 0;
  listHabitos: Habito[] = [];
  listHistorico: any[] = [];

  listCards = [
    {
      description: 'Progresso',
      complement: 0 + '%',
      icon: 'assets/png/icon-progress.png',
    },
    {
      description: 'Hábitos Completos',
      complement: '0/' + 0,
      icon: 'assets/png/icon-complete.png',
    },
    {
      description: 'Sequência Atual',
      complement: 0 + ' Dias',
      icon: 'assets/png/icon-sequence.png',
    },
    {
      description: 'Total de Hábitos',
      complement: 0 + '',
      icon: 'assets/png/icon-hab.png',
    },
  ];

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Hábitos concluídos', backgroundColor: '#3b82f6' }],
  };

  barChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        ticks: {
          color: '#9ca3af',
          stepSize: 1,
          precision: 0,
        },
        grid: { color: '#2d3348' },
      },
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: '#2d3348' },
      },
    },
  };

  doughnutData: ChartData<'doughnut'> = {
    datasets: [
      {
        data: [50, 50], // [progresso, restante]
        backgroundColor: ['#3b82f6', '#2d3348'],
        borderWidth: 0,
      },
    ],
  };

  doughnutOptions = {
    cutout: '80%',
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  constructor(
    private historicoService: HistoricoService,
    private habitoService: HabitoService,
  ) {}

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario')!);
    this.loadResumoSemanal(this.usuario.id);
    this.loadHabitos();
    this.loadQntdHabEsteMes();
    this.loadMediaHabitosCompletados();
  }

  loadResumoSemanal(userId: number) {
    this.historicoService.getResumoSemanal(userId).subscribe((res) => {
      const mapaQuantidade = new Map(res.map((r) => [r.dia.trim(), r.quantidade]));

      this.barChartData = {
        labels: DIAS_GRAFICO_SEMANAL.map((d) => d.rotulo),
        datasets: [
          {
            data: DIAS_GRAFICO_SEMANAL.map((d) => mapaQuantidade.get(d.chave) ?? 0),
            label: 'Hábitos concluídos',
            backgroundColor: '#3b82f6',
          },
        ],
      };
    });
  }

  loadHabitos() {
    this.habitoService.getHabitos().subscribe((habitos) => {
      this.listHabitos = habitos.map((h) => ({
        ...h,
        meta: 1,
        current: 0,
      }));
      this.quantidadeHabitos = habitos.length;
      this.loadMelhorSequencia();

      this.loadHabitosCompletadosHoje();

      if (habitos.length > 0) {
        this.getConsecutivesDay(habitos[0].id);
      }

      this.totalHabitos = habitos.length;
    });
  }

  loadHabitosCompletadosHoje() {
    const hoje = new Date().toISOString().split('T')[0];

    this.historicoService.getListHistoricoByDate(hoje).subscribe((res) => {
      const completed = (res ?? []).filter((registro: any) => registro.concluido === true).length;
      this.habitoscount = completed;

      this.progress = this.listHabitos.length
        ? Math.round((completed / this.listHabitos.length) * 100)
        : 0;

      const restante = 100 - this.progress;

      this.doughnutData = {
        datasets: [
          {
            data: [this.progress, restante],
            backgroundColor: ['#3b82f6', '#2d3348'],
            borderWidth: 0,
          },
        ],
      };
      this.updateCards();
    });
  }

  updateCards() {
    this.listCards = [
      {
        description: 'Total de Hábitos',
        complement: this.quantidadeHabitos.toString(),
        icon: 'assets/png/icon-hab.png',
      },
      {
        description: 'Progresso',
        complement: this.progress + '%',
        icon: 'assets/png/icon-progress.png',
      },
      {
        description: 'Hábitos Completos',
        complement: this.habitoscount + '/' + this.quantidadeHabitos,
        icon: 'assets/png/icon-complete.png',
      },
      {
        description: 'Sequência Atual',
        complement: this.streak + ' Dias',
        icon: 'assets/png/icon-sequence.png',
      },
    ];
  }

  loadMelhorSequencia() {
    if (!this.listHabitos.length) return;
    const firstHabitoId = this.listHabitos[0].id;
    this.historicoService.getMelhorSequencia(this.usuario.id, firstHabitoId).subscribe({
      next: (res) => (this.bestSequencia = res),
    });
  }

  loadQntdHabEsteMes() {
    this.historicoService.getqntdHabitosEsteMes(this.usuario.id).subscribe({
      next: (res) => (this.qntdEsteMes = res),
    });
  }

  loadMediaHabitosCompletados() {
    this.historicoService.getMediaHabitoCompletado(this.usuario.id).subscribe({
      next: (res) => (this.mediaHabitosCompletados = res),
    });
  }

  getConsecutivesDay(habitoId: number) {
    this.historicoService.getStreak(habitoId).subscribe({
      next: (res) => {
        this.streak = res;
        this.updateCardsAfterStreak();
      },
    });
  }

  updateCardsAfterStreak() {
    const streakCard = this.listCards.find((c) => c.description === 'Sequência Atual');

    if (streakCard) {
      streakCard.complement = this.streak + ' Dias';
    }
  }

  getDataFormatada(): string {
    const hoje = new Date();
    return hoje.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }
}
