import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent) },
  { path: 'reset-password', loadComponent: () => import('./pages/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent) },
  { path: 'map', canLoad:[authGuard] loadComponent: () => import('./pages/map/map.component').then((m) => m.MapComponent) },
];
