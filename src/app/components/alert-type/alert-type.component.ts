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
import { ServerError } from '../../models/server-error';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AlertType } from '../../models/alert-type';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AlertTypeModal } from '../../models/alert-type-modal';
import { ActionModal } from '../../models/action-modal';
import { AlertTypesStore } from '../../stores/alert-type.store';
import { handleFormErrors } from '../../misc/handle-form-errors';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-alert-type',
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
    MatDialogClose,
    MatProgressSpinnerModule,
  ],
  templateUrl: './alert-type.component.html',
  styleUrl: './alert-type.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertTypeComponent {
  public readonly store = inject(AlertTypesStore);
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AlertTypeComponent>);
  private readonly data: AlertTypeModal = inject(MAT_DIALOG_DATA);
  public alertTypeForm = this.fb.group({
    code: [this.data.alertType.code, [Validators.required]],
    description: [this.data.alertType.description, [Validators.required]],
  });
  public errorMessages = signal<ServerError>({});

  public get code() {
    return this.alertTypeForm.get('code');
  }

  public get description() {
    return this.alertTypeForm.get('description');
  }

  public async submit(): Promise<void> {
    if (this.alertTypeForm.valid) {
      this.errorMessages.set({});
      const alertType = {
        id: this.data.alertType.id,
        code: this.alertTypeForm.value.code,
        description: this.alertTypeForm.value.description,
      };

      const operation =
        this.data.type == ActionModal.create
          ? 'createAlertType'
          : 'updateAlertType';

      await this.store[operation](alertType as AlertType);

      const httpError = this.store.error();
      if (httpError && httpError.status === 400) {
        handleFormErrors(this.alertTypeForm, httpError, this.errorMessages);
      } else {
        this.dialogRef.close(true);
      }
    }
  }
}
