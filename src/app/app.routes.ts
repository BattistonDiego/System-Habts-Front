import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { loginGuard } from './guards/login-guard';
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
    path: 'dashboard',
    // canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/dashboard-page/dashboard-page').then((c) => c.DashboardPage),
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
