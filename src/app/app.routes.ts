import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canLoad: [authGuard],
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/layout/layout.component').then(
        (m) => m.LayoutComponent,
      ),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'map' },
      {
        path: 'map',
        loadComponent: () =>
          import('./pages/map/map.component').then((m) => m.MapComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'beneficiary-types' },
      {
        path: 'beneficiary-types',
        loadComponent: () =>
          import('./pages/beneficiary-types/beneficiary-types.component').then(
            (m) => m.BeneficiaryTypesComponent,
          ),
      },
      {
        path: 'alert-types',
        loadComponent: () =>
          import('./pages/alert-types/alert-types.component').then(
            (m) => m.AlertTypesComponent,
          ),
      },
      {
        path: 'beneficiaries',
        loadComponent: () =>
          import('./pages/beneficiaries/beneficiaries.component').then(
            (m) => m.BeneficiariesComponent,
          ),
      },
    ],
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
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: 'error/:code',
    loadComponent: () =>
      import('./pages/error/error.component').then((m) => m.ErrorComponent),
  },
  { path: '**', redirectTo: '/error/404' },
];
