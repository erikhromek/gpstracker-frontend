import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Alert, AlertState } from '../../models/alert';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AlertStatePipe } from '../../pipes/alert-state.pipe';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ServerError } from '../../models/server-error';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { handleFormErrors } from '../../misc/handle-form-errors';
import { AlertsStore } from '../../stores/alert.store';
import { AlertTypesStore } from '../../stores/alert-type.store';

@Component({
  selector: 'app-alert-attend',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  providers: [AlertStatePipe],
  templateUrl: './alert-attend.component.html',
  styleUrl: './alert-attend.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertAttendComponent {
  public readonly storeAlerts = inject(AlertsStore);
  public readonly storeAlertTypes = inject(AlertTypesStore);
  public readonly alert: Alert = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AlertAttendComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly alertStatePipe = inject(AlertStatePipe);
  public alertForm = this.fb.group({
    beneficiaryName: [{ value: '', disabled: true }, Validators.required],
    telephone: [{ value: '', disabled: true }, Validators.required],
    beneficiaryDescription: [
      { value: '', disabled: true },
      Validators.required,
    ],
    beneficiaryTypeDescription: [{ value: '', disabled: true }],
    typeId: [{ value: null as unknown as number, disabled: true }],
    state: [{ value: '', disabled: true }, Validators.required],
    observations: [{ value: '', disabled: true }],
  });
  public errorMessages = signal<ServerError>({});
  public AlertState = AlertState;

  constructor() {
    effect(() => {
      const alertTypes = this.storeAlertTypes.entities();
      if (alertTypes) {
        this.patchFormValues();
      }
    });
  }

  private patchFormValues(): void {
    this.alertForm.patchValue(this.alert);
    if (this.alert.state === AlertState.A) {
      this.alertForm.get('typeId')?.enable();
      this.alertForm.get('observations')?.enable();
    }
    this.state?.setValue(this.alertStatePipe.transform(this.alert.state));
  }

  public get beneficiaryName() {
    return this.alertForm.get('beneficiaryName');
  }

  public get telephone() {
    return this.alertForm.get('telephone');
  }

  public get beneficiaryDescription() {
    return this.alertForm.get('beneficiaryDescription');
  }

  public get beneficiaryTypeDescription() {
    return this.alertForm.get('beneficiaryTypeDescription');
  }

  public get typeId() {
    return this.alertForm.get('typeId');
  }

  public get state() {
    return this.alertForm.get('state');
  }

  public get observations() {
    return this.alertForm.get('observations');
  }

  public async submit(): Promise<void> {
    this.errorMessages.set({});

    const alertUpdated = { ...this.alert, ...this.alertForm.value } as Alert;
    alertUpdated.state =
      this.alert.state === AlertState.A ? AlertState.C : AlertState.A;

    await this.storeAlerts.updateAlert(alertUpdated);

    const httpError = this.storeAlerts.error();
    if (httpError && httpError.status === 400) {
      handleFormErrors(this.alertForm, httpError, this.errorMessages);
    } else {
      this.dialogRef.close(true);
    }
  }
}
