import { Routes } from '@angular/router';
import { HabtsPage } from './features/habts-page/habts-page';
import { LoginPage } from './features/login-page/login-page';
import { authGuard } from './service/auth-guard';
import { loginGuard } from './service/login-guard';
import { CreateUserPage } from './features/create-user-page/create-user-page';
import { UsersPage } from './features/users-page/users-page';
import { Testes } from './components/testes/testes';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage, canActivate: [loginGuard] },
  { path: 'habits', component: HabtsPage, canActivate: [authGuard] },
  { path: 'create-user', component: CreateUserPage },
  { path: 'users', component: UsersPage },
  {
    path: 'users/edit/:id',
    component: CreateUserPage,
  },
  { path: 'testes', component: Testes },
];
