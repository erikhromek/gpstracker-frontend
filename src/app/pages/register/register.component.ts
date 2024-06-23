import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, EMPTY, catchError, timer } from 'rxjs';
import { ServerError } from '../../models/server-error';
import { RegisterUser } from '../../models/register-user';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { handleFormErrors } from '../../misc/handle-form-errors';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  public registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    password: ['', Validators.required],
    password2: ['', Validators.required],
    organizationName: ['', Validators.required],
  });
  public isSuccess$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(
    false,
  );
  public errorMessages = signal<ServerError>({});

  ngOnInit() {
    this.checkSession();
  }

  public get email() {
    return this.registerForm.get('email');
  }

  public get password() {
    return this.registerForm.get('password');
  }

  public get password2() {
    return this.registerForm.get('password2');
  }

  public get name() {
    return this.registerForm.get('name');
  }

  public get surname() {
    return this.registerForm.get('surname');
  }

  get organizationName() {
    return this.registerForm.get('organizationName');
  }

  public submit() {
    if (this.registerForm.valid) {
      this.errorMessages.set({});
      this.authService
        .register(this.registerForm.value as RegisterUser)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error: HttpErrorResponse) => {
            handleFormErrors(this.registerForm, error, this.errorMessages);
            return EMPTY;
          }),
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

  private checkSession(): void {
    this.authService.isLoggedIn() ? this.router.navigateByUrl('/map') : false;
  }
}
