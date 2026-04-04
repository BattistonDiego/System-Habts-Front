import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { User } from '../../interface/user.model';
import { UsuarioService } from '../../service/usuario.service';

@Component({
  selector: 'app-users-page',
  imports: [MatTableModule],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss',
})
export class UsersPage implements OnInit {
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
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.dataSource = res;
      },
    });
  }
}
