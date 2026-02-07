import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-login-page',
  imports: [MatCheckboxModule, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private formbuilder: FormBuilder,
    private authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  login() {
    const email = this.loginForm.value.email;
    const senha = this.loginForm.value.senha;

    if (!this.loginForm.valid) {
      return;
    }

    // this.router.navigate(['/Habits']);
    this.authService.login(email, senha).subscribe({
      next: (value) => {
        console.log(value);
      },
      error: (err) => {
        console.log('Erro no login', err);
      },
    });

    console.log(this.loginForm.value);
  }
}
