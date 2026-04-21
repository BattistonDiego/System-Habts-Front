import { Routes } from '@angular/router';
import { authGuard } from './service/auth-guard';
import { loginGuard } from './service/login-guard';
import { Testes } from './components/testes/testes';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./features/login-page/login-page').then((c) => c.LoginPage),
  },
  {
    path: 'habits',
    canActivate: [authGuard],
    loadComponent: () => import('./features/habts-page/habts-page').then((c) => c.HabtsPage),
  },
  {
    path: 'users',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/users-page/users-page').then((c) => c.UsersPage),
  },
  {
    path: 'create-user',
    loadComponent: () =>
      import('./features/create-user-page/create-user-page').then((c) => c.CreateUserPage),
  },
  {
    path: 'users/edit/:id',
    loadComponent: () =>
      import('./features/create-user-page/create-user-page').then((c) => c.CreateUserPage),
  },
  { path: 'testes', component: Testes },
];
