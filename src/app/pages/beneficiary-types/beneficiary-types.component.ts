import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { BeneficiaryTypeComponent } from '../../components/beneficiary-type/beneficiary-type.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { ActionModal } from '../../models/action-modal';
import { BeneficiaryTypesStore } from '../../stores/beneficiary-type.store';

@Component({
  selector: 'app-beneficiary-types',
  standalone: true,
  imports: [
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './beneficiary-types.component.html',
  styleUrl: './beneficiary-types.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeneficiaryTypesComponent {
  public readonly store = inject(BeneficiaryTypesStore);
  public readonly columnsToDisplay = ['id', 'code', 'description', 'actions'];
  private readonly dialog = inject(MatDialog);

  public openCreateModal(): void {
    const beneficiaryType = { id: -1, code: '', description: '' };
    this.dialog.open(BeneficiaryTypeComponent, {
      data: { action: ActionModal.create, beneficiaryType },
      width: '90vw',
      maxWidth: '650px',
    });
  }

  public openEditModal(id: number): void {
    this.store.setBeneficiaryType(id);
    const beneficiaryType = this.store.selectedEntity();
    this.dialog.open(BeneficiaryTypeComponent, {
      data: { action: ActionModal.update, beneficiaryType },
      width: '90vw',
      maxWidth: '650px',
    });
  }

  public openDeleteModal(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: '¿Desea eliminar el tipo de beneficiario?',
      width: '90vw',
      maxWidth: '650px',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.store.deleteBeneficiaryType(id);
      }
    });
  }
}
