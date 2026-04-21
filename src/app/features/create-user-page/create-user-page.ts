import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbar } from '../../components/custom-snackbar/custom-snackbar';

@Component({
  selector: 'app-create-user-page',
  imports: [RouterLink, MatButtonToggleModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-user-page.html',
  styleUrl: './create-user-page.scss',
})
export class CreateUserPage implements OnInit {
  form!: FormGroup;

  isEdit!: boolean;

  idUser!: any;

  constructor(
    private fb: FormBuilder,
    private userService: UsuarioService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      senha: ['', [Validators.minLength(4)]],
      status: ['ativo', [Validators.required]],
      perfil: ['usuario', [Validators.required]],
    });

    this.idUser = this.route.snapshot.paramMap.get('id');

    if (this.idUser) {
      this.isEdit = true;
      this.userService.getUserById(this.idUser).subscribe((user: User) => {
        this.form.patchValue({
          nome: user.nome,
          email: user.email,
          telefone: user.telefone,
          senha: user.senha,
          status: user.status.toLocaleLowerCase(),
          perfil: user.perfil.toLocaleLowerCase(),
        });
      });
    }
  }

  createUser() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEdit) {
      const user = {
        ...this.form.value,
        status: this.form.get('status')?.value.toUpperCase(),
        perfil: this.form.get('perfil')?.value.toUpperCase(),
      };
      this.userService.updateUser(this.idUser, user).subscribe({
        next: () => this.messageSuccess('Usuário atualizado com sucesso'),
      });
    } else {
      const usuario = this.showdata();
      this.userService.postUser(usuario).subscribe({
        next: () => {
          this.messageSuccess('Usuário criado com sucesso');
          this.form.reset();
        },
      });
    }
  }

  showdata(): User {
    const form = {
      ...this.form.value,
      status: this.form.get('status')?.value.toUpperCase(),
      perfil: this.form.get('perfil')?.value.toUpperCase(),
    };
    return form;
  }

  messageSuccess(message: string) {
    this.snackBar.openFromComponent(CustomSnackbar, {
      data: {
        message: message,
        icon: 'check_circle',
      },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
    });
  }
}
