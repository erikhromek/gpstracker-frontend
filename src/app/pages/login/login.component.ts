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
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthUser } from '../../models/auth-user';
import { ServerError } from '../../models/server-error';
import { EMPTY, catchError } from 'rxjs';
import { NgOptimizedImage } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { handleFormErrors } from '../../misc/handle-form-errors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  public errorMessages = signal<ServerError>({});

  ngOnInit() {
    this.checkSession();
  }

  public get email() {
    return this.loginForm.get('email');
  }

  public get password() {
    return this.loginForm.get('password');
  }

  private checkSession(): void {
    this.authService.isLoggedIn() ? this.router.navigateByUrl('/map') : false;
  }

  public submit(): void {
    if (this.loginForm.valid) {
      this.errorMessages.set({});
      this.authService
        .login(this.loginForm.value as AuthUser)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error: HttpErrorResponse) => {
            handleFormErrors(this.loginForm, error, this.errorMessages);
            return EMPTY;
          }),
        )
        .subscribe(() => {
          const returnUrl =
            this.route.snapshot.queryParams['returnUrl'] || '/map';
          this.router.navigateByUrl(returnUrl);
        });
    }
  }
}
