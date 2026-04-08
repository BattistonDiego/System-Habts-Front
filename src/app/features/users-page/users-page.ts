import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { User } from '../../interface/user.model';
import { UsuarioService } from '../../service/usuario.service';
import { RouterLink } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginatorIntl } from '../../core/paginator/custom-paginator';

@Component({
  selector: 'app-users-page',
  imports: [
    MatTableModule,
    RouterLink,
    MatButtonToggleModule,
    FormsModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useFactory: CustomPaginatorIntl }],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss',
})
export class UsersPage implements OnInit {
  filtro = 'todos';
  inactiveUsers = 0;
  activeUsers = 0;

  totalElements = 0;
  sizePage = 8;

  columns = [];
  displayedColumns: string[] = ['nome', 'email', 'telefone', 'status', 'perfil', 'acoes'];

  dataSource: User[] = [
    {
      id: 1,
      nome: 'Diego',
      email: 'diego@email.com',
      telefone: '123456',
      perfil: 'ADMINISTRADOR',
      status: 'ATIVO',
    },
    {
      id: 1,
      nome: 'Julia',
      email: 'julia@email.com',
      telefone: '234567',
      perfil: 'ADMINISTRADOR',
      status: 'ATIVO',
    },
  ];

  constructor(private userService: UsuarioService) {}

  ngOnInit(): void {
    this.loadUsers(0, this.sizePage);
    this.userService.getResume().subscribe({
      next: (res) => {
        this.activeUsers = res.ativos;
        this.inactiveUsers = res.inativos;
      },
    });
  }

  loadUsers(pageIndex: number, pageSize: number) {
    this.userService.getAllUsers(pageIndex, pageSize).subscribe({
      next: (res) => {
        this.dataSource = res.content;
        this.totalElements = res.totalElements;
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.loadUsers(event.pageIndex, event.pageSize);
  }
}
