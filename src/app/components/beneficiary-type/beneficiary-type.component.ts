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
import { BeneficiaryTypeService } from '../../services/beneficiary-type.service';
import { BeneficiaryType } from '../../models/beneficiary-type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-beneficiary-type',
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
    MatDialogClose
  ],
  templateUrl: './beneficiary-type.component.html',
  styleUrl: './beneficiary-type.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeneficiaryTypeComponent {
  private destroyRef = inject(DestroyRef);
  beneficiaryTypeForm = this.fb.group({
    code: [this.data.code, [Validators.required]],
    description: [this.data.description, [Validators.required]],
  });
  errorMessages$ = new BehaviorSubject<ServerError>({});

  constructor(
    public dialogRef: MatDialogRef<BeneficiaryTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BeneficiaryType,
    private beneficiaryTypeService: BeneficiaryTypeService,
    private fb: FormBuilder
  ) {}

  get code() {
    return this.beneficiaryTypeForm.get('code');
  }

  get description() {
    return this.beneficiaryTypeForm.get('description');
  }

  submit() {
    if (this.beneficiaryTypeForm.valid) {
      this.errorMessages$.next({});
      const updateBeneficiaryType = {
        code: this.beneficiaryTypeForm.value.code,
        description: this.beneficiaryTypeForm.value.description,
      };
      this.beneficiaryTypeService
        .updateBeneficiaryType(
          this.data.id,
          updateBeneficiaryType as BeneficiaryType
        )
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
    this.beneficiaryTypeForm.setErrors({ invalid: true });
    if (error.error) {
      this.errorMessages$.next(error.error as ServerError);

      Object.keys(this.errorMessages$.value).forEach((key) => {
        const control = this.beneficiaryTypeForm.get(key);
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
