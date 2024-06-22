import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Beneficiary, BeneficiaryCompany } from '../../models/beneficiary';
import { CommonModule } from '@angular/common';
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
import { ActionModal } from '../../models/action-modal';
import { ServerError } from '../../models/server-error';
import { BeneficiaryModal } from '../../models/beneficiary-modal';
import { MatOption } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { BeneficiariesStore } from '../../stores/beneficiary.store';
import { handleFormErrors } from '../../misc/handle-form-errors';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule,
  ],
  templateUrl: './beneficiary.component.html',
  styleUrl: './beneficiary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeneficiaryComponent {
  public readonly store = inject(BeneficiariesStore);
  public readonly data: BeneficiaryModal = inject(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<BeneficiaryComponent>);
  public beneficiaryForm = this.fb.group({
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
  public readonly companyKeys = Object.keys(BeneficiaryCompany);
  public readonly companyValues = Object.values(BeneficiaryCompany);
  public errorMessages = signal<ServerError>({});

  public get name() {
    return this.beneficiaryForm.get('name');
  }

  public get surname() {
    return this.beneficiaryForm.get('surname');
  }

  public get company() {
    return this.beneficiaryForm.get('company');
  }

  public get enabled() {
    return this.beneficiaryForm.get('enabled');
  }

  public get typeId() {
    return this.beneficiaryForm.get('typeId');
  }

  public get description() {
    return this.beneficiaryForm.get('description');
  }

  public get telephone() {
    return this.beneficiaryForm.get('telephone');
  }

  public async submit(): Promise<void> {
    if (this.beneficiaryForm.valid) {
      this.errorMessages.set({});
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

      await this.store[operation](beneficiary as Beneficiary);

      const httpError = this.store.error();
      if (httpError && httpError.status === 400) {
        handleFormErrors(this.beneficiaryForm, httpError, this.errorMessages);
      } else {
        this.dialogRef.close(true);
      }
    }
  }
}
