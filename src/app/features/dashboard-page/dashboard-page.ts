import { Component, OnInit } from '@angular/core';
import { Habito, Usuario } from '../../interface/habito.model';
import { RouterLink } from '@angular/router';
import { Card } from '../../components/card/card';
import { CommonModule } from '@angular/common';
import { HistoricoService } from '../../service/historico.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';
import { User } from '../../interface/user.model';
import { HabitoService } from '../../service/habito.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, Card, CommonModule, BaseChartDirective],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  usuario!: User;

  progress = 0;
  quantidadeHabitos = 0;
  habitoscount = 0;
  bestSequencia: number = 0;

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
      description: 'Sequência',
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
    this.loadMelhorSequencia();
  }

  loadResumoSemanal(userId: number) {
    this.historicoService.getResumoSemanal(userId).subscribe((res) => {
      const dias = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const mapaQuantidade = new Map(res.map((r) => [r.dia.trim(), r.quantidade]));

      this.barChartData = {
        labels: dias,
        datasets: [
          {
            data: dias.map((d) => mapaQuantidade.get(d) ?? 0),
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
        current: 0,
      }));
      this.quantidadeHabitos = habitos.length;

      this.loadHabitosCompletadosHoje();

      this.totalHabitos = habitos.length;
    });
  }

  loadHabitosCompletadosHoje() {
    const hoje = new Date().toISOString().split('T')[0];

    this.historicoService.getListHistoricoByDate(hoje).subscribe((res) => {
      const completed = res.length;
      this.habitoscount = completed;

      if (res.length > 0) {
        this.progress =
          completed === 0 ? 0 : Math.round((completed / this.listHabitos.length) * 100);

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
      }
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
        description: 'Melhor Sequência',
        complement: this.bestSequencia + ' Dias',
        icon: 'assets/png/icon-sequence.png',
      },
    ];
  }

  loadMelhorSequencia() {
    this.historicoService.getMelhorSequencia(this.usuario.id).subscribe({
      next: (res) => (this.bestSequencia = res),
    });
  }
}
