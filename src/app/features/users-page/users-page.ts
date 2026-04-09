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
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteUserModal } from '../../components/modals/delete-user-modal/delete-user-modal';

@Component({
  selector: 'app-users-page',
  imports: [
    CommonModule,
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

  textoBusca: string = '';

  isList = true;
  globalListDefault: User[] = [];

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
  pageatual: number = 0;

  constructor(
    private userService: UsuarioService,
    private dialog: MatDialog,
  ) {}

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
        this.globalListDefault = res.content;
        this.totalElements = res.totalElements;

        this.filterList();
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.pageatual = event.pageIndex;
    this.loadUsers(event.pageIndex, event.pageSize);
  }

  filterList(event?: Event) {
    if (event) {
      this.textoBusca = (event.target as HTMLInputElement).value.toLowerCase().trim();
    }

    this.dataSource = this.globalListDefault.filter((user) => {
      const passaStatus = this.filtro === 'todos' || user.status === this.filtro;
      const passaTexto = user.nome.toLowerCase().includes(this.textoBusca);
      return passaStatus && passaTexto;
    });

    this.isList = this.dataSource.length > 0;
  }

  inativeUser(user: User) {
    const dialogRef = this.dialog.open(DeleteUserModal, {});

    dialogRef.afterClosed().subscribe((res: User) => {
      if (res) {
        this.userService.putInativeUser(user).subscribe(() => {
          this.loadUsers(this.pageatual, this.sizePage);
        });
      }
    });
  }
}
