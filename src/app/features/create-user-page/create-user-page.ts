import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-user-page',
  imports: [RouterLink, MatButtonToggleModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-user-page.html',
  styleUrl: './create-user-page.scss',
})
export class CreateUserPage implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      nome: [''],
      email: [''],
      telefone: [''],
      senha: ['ativo'],
      status: ['ativo'],
      perfil: ['user'],
    });
  }

  showdata() {
    console.log(this.form.value);
  }
}
