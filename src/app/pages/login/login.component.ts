import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthUser } from '../../models/auth-user';
import { ServerError } from '../../models/server-error';
import { BehaviorSubject, EMPTY, catchError } from 'rxjs';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    RouterLink,
    ReactiveFormsModule,
    NgOptimizedImage,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  errorMessages$ = new BehaviorSubject<ServerError>({});

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.checkSession();
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  checkSession(): void {
    this.authService.isLoggedIn() ? this.router.navigateByUrl('/map') : false;
  }

  submit(): void {
    if (this.loginForm.valid) {
      this.errorMessages$.next({});
      this.authService
        .login(this.loginForm.value as AuthUser)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.handleErrors(error);
            return EMPTY;
          })
        )
        .subscribe(() => {
          const returnUrl =
            this.route.snapshot.queryParams['returnUrl'] || '/map';
          this.router.navigateByUrl(returnUrl);
        });
    }
  }

  handleErrors(error: HttpErrorResponse): void {
    this.loginForm.setErrors({ invalid: true });
    if (error.error) {
      this.errorMessages$.next(error.error as ServerError);

      Object.keys(this.errorMessages$.value).forEach((key) => {
        const control = this.loginForm.get(key);
        if (control) {
          control.setErrors({ serverError: this.errorMessages$.value[key] });
          control.markAsTouched();
          control.markAsDirty();
        }
      });
    } else {
      this.errorMessages$.next({ detail: 'Ha ocurrido un error inesperado' });
    }
  }
}
