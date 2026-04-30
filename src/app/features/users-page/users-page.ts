import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { User } from '../../interface/user.model';
import { UsuarioService } from '../../service/usuario.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginatorIntl } from '../../core/paginator/custom-paginator';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteUserModal } from '../../components/modals/delete-user-modal/delete-user-modal';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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
  filtro = 'ATIVO';
  inactiveUsers = 0;
  activeUsers = 0;

  totalElements = 0;
  sizePage = 8;

  textoBusca: string = '';

  isList = true;
  globalListDefault: User[] = [];

  dataSource: User[] = [];
  pageatual: number = 0;

  columns = [];
  isMobile = window.innerWidth <= 600;
  displayedColumns = this.isMobile
    ? ['nome', 'status', 'acoes']
    : ['nome', 'email', 'telefone', 'status', 'perfil', 'acoes'];

  private buscaSubject = new Subject<string>();

  constructor(
    private userService: UsuarioService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadUsers(0, this.sizePage, this.filtro);
    this.userService.getResume().subscribe({
      next: (res) => {
        this.activeUsers = res.ativos;
        this.inactiveUsers = res.inativos;
      },
    });

    this.buscaSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(), // só dispara se o valor mudou
      )
      .subscribe((texto) => {
        this.dataSource = this.globalListDefault.filter((user) =>
          user.nome.toLowerCase().includes(texto.toLowerCase()),
        );
      });
  }

  loadUsers(pageIndex: number, pageSize: number, status?: string) {
    console.log('userService:', this.userService);
    this.userService.getAllUsers(pageIndex, pageSize, status).subscribe({
      next: (res) => {
        this.dataSource = res.content;
        this.globalListDefault = res.content;
        this.totalElements = res.totalElements;
        this.isList = this.dataSource.length > 0;
      },
    });
  }

  filterList(event?: Event) {
    if (event) {
      this.textoBusca = (event.target as HTMLInputElement).value.toLowerCase().trim();

      this.buscaSubject.next(this.textoBusca);
    } else {
      if (this.filtro === 'todos') {
        this.loadUsers(0, this.sizePage);
      } else {
        this.loadUsers(0, this.sizePage, this.filtro);
      }
    }
  }

  onPageChange(event: PageEvent) {
    this.pageatual = event.pageIndex;

    if (this.filtro === 'todos') {
      this.loadUsers(event.pageIndex, event.pageSize);
    } else {
      this.loadUsers(event.pageIndex, event.pageSize, this.filtro);
    }
  }

  inativeUser(user: User) {
    const dialogRef = this.dialog.open(DeleteUserModal, {
      data: { nome: user.nome, email: user.email },
    });

    dialogRef.afterClosed().subscribe((res: User) => {
      if (res) {
        this.userService.putInativeUser(user).subscribe(() => {
          this.loadUsers(this.pageatual, this.sizePage);
        });
      }
    });
  }

  editUser(user: User) {
    this.router.navigate(['/users/edit', user.id]);
  }
}
