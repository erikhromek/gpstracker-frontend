import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Inject,
  inject,
} from '@angular/core';
import { Beneficiary, BeneficiaryCompany } from '../../models/beneficiary';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, catchError, EMPTY } from 'rxjs';
import { ActionModal } from '../../models/action-modal';
import { ServerError } from '../../models/server-error';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { BeneficiaryModal } from '../../models/beneficiary-modal';
import { MatOption } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-beneficiary',
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
    MatOption,
    MatCheckboxModule,
    MatSelectModule,
  ],
  templateUrl: './beneficiary.component.html',
  styleUrl: './beneficiary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeneficiaryComponent {
  companyKeys = Object.keys(BeneficiaryCompany);
  companyValues = Object.values(BeneficiaryCompany);

  errorMessages$ = new BehaviorSubject<ServerError>({});

  private destroyRef = inject(DestroyRef);
  beneficiaryForm = this.fb.group({
    name: [this.data.beneficiary.name, [Validators.required]],
    surname: [this.data.beneficiary.surname, [Validators.required]],
    telephone: [
      this.data.beneficiary.telephone,
      [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(10),
        Validators.maxLength(10),
      ],
    ],
    company: [this.data.beneficiary.company],
    enabled: [this.data.beneficiary.enabled, [Validators.required]],
    typeId: [this.data.beneficiary.typeId],
    description: [this.data.beneficiary.description],
  });

  constructor(
    public dialogRef: MatDialogRef<BeneficiaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BeneficiaryModal,
    private fb: FormBuilder,
    private beneficiaryService: BeneficiaryService,
  ) {}

  get name() {
    return this.beneficiaryForm.get('name');
  }

  get surname() {
    return this.beneficiaryForm.get('surname');
  }

  get company() {
    return this.beneficiaryForm.get('company');
  }

  get enabled() {
    return this.beneficiaryForm.get('enabled');
  }

  get typeId() {
    return this.beneficiaryForm.get('typeId');
  }

  get description() {
    return this.beneficiaryForm.get('description');
  }

  get telephone() {
    return this.beneficiaryForm.get('telephone');
  }

  submit() {
    if (this.beneficiaryForm.valid) {
      this.errorMessages$.next({});
      const beneficiary = {
        id: this.data.beneficiary.id,
        name: this.beneficiaryForm.value.name,
        surname: this.beneficiaryForm.value.surname,
        company: this.beneficiaryForm.value.company,
        enabled: this.beneficiaryForm.value.enabled,
        telephone: this.beneficiaryForm.value.telephone,
        typeId: this.beneficiaryForm.value.typeId,
        description: this.beneficiaryForm.value.description,
      };

      const operation =
        this.data.type == ActionModal.create
          ? 'createBeneficiary'
          : 'updateBeneficiary';

      this.beneficiaryService[operation](beneficiary as Beneficiary)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              this.handleErrors(error);
            } else {
              this.dialogRef.close(false);
            }
            return EMPTY;
          }),
        )
        .subscribe(() => {
          this.dialogRef.close(true);
        });
    }
  }

  handleErrors(error: HttpErrorResponse): void {
    this.beneficiaryForm.setErrors({ invalid: true });
    if (error.error) {
      this.errorMessages$.next(error.error as ServerError);

      Object.keys(this.errorMessages$.value).forEach((key) => {
        const control = this.beneficiaryForm.get(key);
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
