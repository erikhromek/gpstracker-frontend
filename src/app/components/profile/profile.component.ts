import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Inject,
  inject,
} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ServerError } from '../../models/server-error';
import { BehaviorSubject, EMPTY, catchError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UpdateUser } from '../../models/update-user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private destroyRef = inject(DestroyRef);
  profileForm = this.fb.group({
    email: [
      { value: this.data.email, disabled: true },
      [Validators.required, Validators.email],
    ],
    name: [this.data.name, [Validators.required]],
    surname: [this.data.surname, [Validators.required]],
    organizationName: [
      { value: this.data.organizationName, disabled: true },
      Validators.required,
    ],
  });
  errorMessages$ = new BehaviorSubject<ServerError>({});

  constructor(
    public dialogRef: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  get email() {
    return this.profileForm.get('email');
  }

  get name() {
    return this.profileForm.get('name');
  }

  get surname() {
    return this.profileForm.get('surname');
  }

  get organizationName() {
    return this.profileForm.get('organizationName');
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  submit() {
    if (this.profileForm.valid) {
      console.log('AA');
      this.errorMessages$.next({});
      const updateUser = {
        name: this.profileForm.value.name,
        surname: this.profileForm.value.surname,
      };
      this.userService
        .updateProfile(this.data.id, updateUser as UpdateUser)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              this.handleErrors(error);
            } else {
              this.dialogRef.close();
            }
            return EMPTY;
          })
        )
        .subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  handleErrors(error: HttpErrorResponse): void {
    this.profileForm.setErrors({ invalid: true });
    if (error.error) {
      this.errorMessages$.next(error.error as ServerError);

      Object.keys(this.errorMessages$.value).forEach((key) => {
        const control = this.profileForm.get(key);
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
