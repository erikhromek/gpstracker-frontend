import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Inject,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, EMPTY, catchError } from 'rxjs';
import { ServerError } from '../../models/server-error';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AlertTypeService } from '../../services/alert-type.service';
import { AlertType } from '../../models/alert-type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AlertTypeModal } from '../../models/alert-type-modal';
import { ActionModal } from '../../models/action-modal';

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
  ],
  templateUrl: './alert-type.component.html',
  styleUrl: './alert-type.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertTypeComponent {
  private destroyRef = inject(DestroyRef);
  alertTypeForm = this.fb.group({
    code: [this.data.alertType.code, [Validators.required]],
    description: [this.data.alertType.description, [Validators.required]],
  });
  errorMessages$ = new BehaviorSubject<ServerError>({});

  constructor(
    public dialogRef: MatDialogRef<AlertTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertTypeModal,
    private alertTypeService: AlertTypeService,
    private fb: FormBuilder
  ) {}

  get code() {
    return this.alertTypeForm.get('code');
  }

  get description() {
    return this.alertTypeForm.get('description');
  }

  submit() {
    if (this.alertTypeForm.valid) {
      this.errorMessages$.next({});
      const alertType = {
        id: this.data.alertType.id,
        code: this.alertTypeForm.value.code,
        description: this.alertTypeForm.value.description,
      };

      const operation =
        this.data.type == ActionModal.create
          ? 'createAlertType'
          : 'updateAlertType';

      this.alertTypeService[operation](alertType as AlertType)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              this.handleErrors(error);
            } else {
              this.dialogRef.close(false);
            }
            return EMPTY;
          })
        )
        .subscribe(() => {
          this.dialogRef.close(true);
        });
    }
  }

  handleErrors(error: HttpErrorResponse): void {
    this.alertTypeForm.setErrors({ invalid: true });
    if (error.error) {
      this.errorMessages$.next(error.error as ServerError);

      Object.keys(this.errorMessages$.value).forEach((key) => {
        const control = this.alertTypeForm.get(key);
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
