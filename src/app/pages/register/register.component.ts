import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { timer } from 'rxjs';
import { ServerError } from '../../models/server-error';
import { RegisterUser } from '../../models/register-user';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { handleFormErrors } from '../../misc/handle-form-errors';
import { AuthStore } from '../../stores/auth.store';

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
  public readonly store = inject(AuthStore);
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

  private checkSession(): void {
    this.store.isLoggedIn() ? this.router.navigateByUrl('/map') : false;
  }

  public async submit() {
    if (this.registerForm.valid) {
      this.errorMessages.set({});

      await this.store.register(this.registerForm.value as RegisterUser);

      const httpError = this.store.error();
      if (httpError) {
        handleFormErrors(this.registerForm, httpError, this.errorMessages);
      } else {
        const source = timer(3000);
        const returnUrl = '/login';
        source
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => this.router.navigateByUrl(returnUrl));
      }
    }
  }
}
