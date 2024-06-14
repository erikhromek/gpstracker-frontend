import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  HttpClientModule,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BehaviorSubject, EMPTY, catchError, timer } from 'rxjs';
import { ServerError } from '../../models/server-error';
import { RegisterUser } from '../../models/register-user';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    RouterLink,
    NgOptimizedImage,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private destroyRef = inject(DestroyRef);
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    password: ['', Validators.required],
    password2: ['', Validators.required],
    organizationName: ['', Validators.required],
  });
  errorMessages$ = new BehaviorSubject<ServerError>({});
  isSuccess$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

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
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get password2() {
    return this.registerForm.get('password2');
  }

  get name() {
    return this.registerForm.get('name');
  }

  get surname() {
    return this.registerForm.get('surname');
  }

  get organizationName() {
    return this.registerForm.get('organizationName');
  }

  submit() {
    if (this.registerForm.valid) {
      this.errorMessages$.next({});
      this.authService
        .register(this.registerForm.value as RegisterUser)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error: HttpErrorResponse) => {
            this.handleErrors(error);
            return EMPTY;
          })
        )
        .subscribe(() => {
          this.isSuccess$.next(true);

          const source = timer(3000);
          const returnUrl = '/login';
          source
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.router.navigateByUrl(returnUrl));
        });
    }
  }

  handleErrors(error: HttpErrorResponse): void {
    this.registerForm.setErrors({ invalid: true });
    if (error.error) {
      this.errorMessages$.next(error.error as ServerError);

      Object.keys(this.errorMessages$.value).forEach((key) => {
        const control = this.registerForm.get(key);
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

  checkSession(): void {
    this.authService.isLoggedIn() ? this.router.navigateByUrl('/map') : false;
  }
}
