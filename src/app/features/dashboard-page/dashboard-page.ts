import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interface/habito.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  usuario!: Usuario;

  constructor() {}

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario')!);
  }
}
