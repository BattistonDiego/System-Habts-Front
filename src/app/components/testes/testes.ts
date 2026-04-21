import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

interface Professor {
  id: number;
  nome: string;
  materia: string;
  status: string;
}

@Component({
  selector: 'app-testes',
  imports: [MatTableModule],
  templateUrl: './testes.html',
  styleUrl: './testes.scss',
})
export class Testes implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'materia', 'status'];
  professores = [
    { id: 1, nome: 'Marcos', materia: 'Matemática', status: 'ATIVO' },
    { id: 2, nome: 'Fernanda', materia: 'História', status: 'ATIVO' },
    { id: 3, nome: 'Lucas', materia: 'Geografia', status: 'INATIVO' },
  ];

  dataSource = new MatTableDataSource<Professor>();

  ngOnInit() {
    this.dataSource.data = this.professores;
  }

  filterList(event: Event) {
    const input = event.target as HTMLInputElement;

    const texto = input.value.toLocaleLowerCase().trim();

    this.dataSource.data = this.professores.filter((user) => {
      return user.nome.toLocaleLowerCase().trim().includes(texto);
    });
  }
}
