import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthUser } from '../../models/auth-user';
import { ServerError } from '../../models/server-error';
import { NgOptimizedImage } from '@angular/common';
import { handleFormErrors } from '../../misc/handle-form-errors';
import { AuthStore } from '../../stores/auth.store';

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
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  public readonly store = inject(AuthStore);
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
    this.store.isLoggedIn() ? this.router.navigateByUrl('/map') : false;
  }

  public async submit(): Promise<void> {
    if (this.loginForm.valid) {
      this.errorMessages.set({});

      await this.store.login(this.loginForm.value as AuthUser);

      const httpError = this.store.error();
      if (httpError) {
        handleFormErrors(this.loginForm, httpError, this.errorMessages);
      } else {
        const returnUrl =
          this.route.snapshot.queryParams['returnUrl'] || '/map';
        this.router.navigateByUrl(returnUrl);
      }
    }
  }
}
