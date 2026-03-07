import { Routes } from '@angular/router';
import { HabtsPage } from './features/habts-page/habts-page';
import { LoginPage } from './features/login-page/login-page';
import { authGuard } from './service/auth-guard';
import { loginGuard } from './service/login-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage, canActivate: [loginGuard] },
  { path: 'habits', component: HabtsPage, canActivate: [authGuard] },
];
