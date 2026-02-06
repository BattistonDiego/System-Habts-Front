import { Routes } from '@angular/router';
import { HabtsPage } from './features/habts-page/habts-page';
import { LoginPage } from './features/login-page/login-page';

export const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  { path: 'Login', component: LoginPage },
  { path: 'Habits', component: HabtsPage },
];
