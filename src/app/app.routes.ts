import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canLoad: [authGuard],
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),
      children: [{path: "", pathMatch: "full", redirectTo: "map"}, {
        path: 'map',
        loadComponent: () =>
          import('./pages/map/map.component').then((m) => m.MapComponent),
      }],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),

  },
  // {
  //   path: 'map',
  //   canLoad: [authGuard],
  //   canActivate: [authGuard],
  //   loadComponent: () =>
  //     import('./pages/map/map.component').then((m) => m.MapComponent),
  // },
  // { path: '', redirectTo: 'map', pathMatch: 'full' },
  { path: '**', redirectTo: 'map' },
];
