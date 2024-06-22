import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
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
import { UsersStore } from '../../stores/user.store';
import { CommonModule } from '@angular/common';
import { ServerError } from '../../models/server-error';
import { handleFormErrors } from '../../misc/handle-form-errors';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  public readonly store = inject(UsersStore);
  private readonly user: User = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ProfileComponent>);
  private readonly fb = inject(FormBuilder);
  public profileForm = this.fb.group({
    email: [
      { value: this.user.email, disabled: true },
      [Validators.required, Validators.email],
    ],
    name: [this.user.name, [Validators.required]],
    surname: [this.user.surname, [Validators.required]],
    organizationName: [
      { value: this.user.organizationName, disabled: true },
      Validators.required,
    ],
  });
  public errorMessages = signal<ServerError>({});

  public get email() {
    return this.profileForm.get('email');
  }

  public get name() {
    return this.profileForm.get('name');
  }

  public get surname() {
    return this.profileForm.get('surname');
  }

  public get organizationName() {
    return this.profileForm.get('organizationName');
  }

  public async submit(): Promise<void> {
    if (this.profileForm.valid) {
      this.errorMessages.set({});

      const updateUser = { ...this.user, ...this.profileForm.value } as User;

      await this.store.updateProfile(updateUser);

      const httpError = this.store.error();
      if (httpError && httpError.status === 400) {
        handleFormErrors(this.profileForm, httpError, this.errorMessages);
      } else {
        this.dialogRef.close(true);
      }
    }
  }
}
