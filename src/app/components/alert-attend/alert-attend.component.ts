import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Inject,
  OnInit,
  inject,
} from '@angular/core';
import { Alert, AlertState } from '../../models/alert';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AlertStatePipe } from '../../pipes/alert-state.pipe';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, EMPTY, Observable, catchError, tap } from 'rxjs';
import { ServerError } from '../../models/server-error';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../../services/alert.service';
import { AlertTypeService } from '../../services/alert-type.service';
import { AlertType } from '../../models/alert-type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-alert-attend',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
  ],
  providers: [AlertStatePipe],
  templateUrl: './alert-attend.component.html',
  styleUrl: './alert-attend.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertAttendComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  alertForm = this.fb.group({
    beneficiaryName: [{ value: '', disabled: true }, Validators.required],
    telephone: [{ value: '', disabled: true }, Validators.required],
    beneficiaryDescription: [
      { value: '', disabled: true },
      Validators.required,
    ],
    beneficiaryTypeDescription: [{ value: '', disabled: true }],
    typeId: [{ value: 0, disabled: true }],
    state: [{ value: '', disabled: true }, Validators.required],
    observations: [{ value: '', disabled: true }],
  });
  alertTypes$!: Observable<AlertType[]>;
  errorMessages$ = new BehaviorSubject<ServerError>({});
  alertStates = AlertState;

  constructor(
    @Inject(MAT_DIALOG_DATA) public alert: Alert,
    private dialogRef: MatDialogRef<AlertAttendComponent>,
    private fb: FormBuilder,
    private alertService: AlertService,
    private alertTypeService: AlertTypeService,
    private alertStatePipe: AlertStatePipe
  ) {}

  ngOnInit(): void {
    this.getAlertTypes();
  }

  patchFormValues(): void {
    this.alertForm.patchValue(this.alert);
    if (this.alert.state === AlertState.A) {
      this.alertForm.get('typeId')?.enable();
      this.alertForm.get('observations')?.enable();
    }
    this.state?.setValue(this.alertStatePipe.transform(this.alert.state));
  }

  private getAlertTypes(): void {
    this.alertTypes$ = this.alertTypeService.getAlertTypes().pipe(
      tap(() => {
        this.patchFormValues();
      })
    );
  }

  get beneficiaryName() {
    return this.alertForm.get('beneficiaryName');
  }

  get telephone() {
    return this.alertForm.get('telephone');
  }

  get beneficiaryDescription() {
    return this.alertForm.get('beneficiaryDescription');
  }

  get beneficiaryTypeDescription() {
    return this.alertForm.get('beneficiaryTypeDescription');
  }

  get typeId() {
    return this.alertForm.get('typeId');
  }

  get state() {
    return this.alertForm.get('state');
  }

  get observations() {
    return this.alertForm.get('observations');
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  submit(): void {
    this.errorMessages$.next({});

    const alertUpdated = { ...this.alert, ...this.alertForm.value } as Alert;
    alertUpdated.state =
      this.alert.state === AlertState.A ? AlertState.C : AlertState.A;
    console.log(alertUpdated);

    this.alertService
      .updateAlert(alertUpdated)
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

  handleErrors(error: HttpErrorResponse): void {
    this.alertForm.setErrors({ invalid: true });
    if (error.error) {
      this.errorMessages$.next(error.error as ServerError);

      Object.keys(this.errorMessages$.value).forEach((key) => {
        const control = this.alertForm.get(key);
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
