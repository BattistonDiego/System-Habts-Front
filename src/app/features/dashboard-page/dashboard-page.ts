import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interface/habito.model';
import { RouterLink } from '@angular/router';
import { Card } from '../../components/card/card';
import { CommonModule } from '@angular/common';
import { HistoricoService } from '../../service/historico.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, Card, CommonModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  usuario!: Usuario;

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

  constructor(private historicoService: HistoricoService) {}

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario')!);
    this.historicoService.getResumoSemanal(1).subscribe((res) => console.log(res));
  }
}
