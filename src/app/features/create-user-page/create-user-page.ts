import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../interface/user.model';
import { UsuarioService } from '../../service/usuario.service';

@Component({
  selector: 'app-create-user-page',
  imports: [RouterLink, MatButtonToggleModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-user-page.html',
  styleUrl: './create-user-page.scss',
})
export class CreateUserPage implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UsuarioService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      senha: ['', [Validators.required, Validators.minLength(4)]],
      status: ['ativo', [Validators.required]],
      perfil: ['usuario', [Validators.required]],
    });
  }

  createUser() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const usuario = this.showdata();
    this.userService.postUser(usuario).subscribe({
      next: (res) => {
        this.form.reset();
      },
    });
  }

  showdata(): User {
    const form = {
      ...this.form.value,
      status: this.form.get('status')?.value.toUpperCase(),
      perfil: this.form.get('perfil')?.value.toUpperCase(),
    };
    return form;
  }
}
