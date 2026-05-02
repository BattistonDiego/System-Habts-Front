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
    console.log('entramos no dash');
    this.usuario = JSON.parse(localStorage.getItem('usuario')!);
    this.loadResumoSemanal(this.usuario.id);
    this.loadHabitos();
  }

  loadResumoSemanal(userId: number) {
    this.historicoService.getResumoSemanal(userId).subscribe((res) => {
      this.barChartData = {
        labels: res.map((r) => r.dia),
        datasets: [
          {
            data: res.map((r) => r.quantidade),
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

      this.loadHabitosCompletadosHoje();

      this.totalHabitos = habitos.length;
    });
  }

  loadHabitosCompletadosHoje() {
    const hoje = new Date().toISOString().split('T')[0];

    this.historicoService.getListHistoricoByDate(hoje).subscribe((res) => {
      const completed = res.length;

      if (res.length > 0) {
        console.log('entrmaos no if pra calcular o progresso');
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
    });
  }
}
