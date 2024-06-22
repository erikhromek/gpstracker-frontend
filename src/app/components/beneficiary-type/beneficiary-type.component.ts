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
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { BeneficiaryType } from '../../models/beneficiary-type';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BeneficiaryTypeModal } from '../../models/beneficiary-type-modal';
import { ActionModal } from '../../models/action-modal';
import { BeneficiaryTypesStore } from '../../stores/beneficiary-type.store';
import { handleFormErrors } from '../../misc/handle-form-errors';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-beneficiary-type',
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
  templateUrl: './beneficiary-type.component.html',
  styleUrl: './beneficiary-type.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeneficiaryTypeComponent {
  public readonly store = inject(BeneficiaryTypesStore);
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<BeneficiaryTypeComponent>);
  private readonly data: BeneficiaryTypeModal = inject(MAT_DIALOG_DATA);
  public beneficiaryTypeForm = this.fb.group({
    code: [this.data.beneficiaryType.code, [Validators.required]],
    description: [this.data.beneficiaryType.description, [Validators.required]],
  });
  public errorMessages = signal<ServerError>({});

  public get code() {
    return this.beneficiaryTypeForm.get('code');
  }

  public get description() {
    return this.beneficiaryTypeForm.get('description');
  }

  public async submit(): Promise<void> {
    if (this.beneficiaryTypeForm.valid) {
      this.errorMessages.set({});
      const beneficiaryType = {
        id: this.data.beneficiaryType.id,
        code: this.beneficiaryTypeForm.value.code,
        description: this.beneficiaryTypeForm.value.description,
      };

      const operation =
        this.data.action === ActionModal.create
          ? 'createBeneficiaryType'
          : 'updateBeneficiaryType';

      await this.store[operation](beneficiaryType as BeneficiaryType);

      const httpError = this.store.error();
      if (httpError && httpError.status === 400) {
        handleFormErrors(
          this.beneficiaryTypeForm,
          httpError,
          this.errorMessages,
        );
      } else {
        this.dialogRef.close(true);
      }
    }
  }
}
