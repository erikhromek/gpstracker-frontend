import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AlertTypeComponent } from '../../components/alert-type/alert-type.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { ActionModal } from '../../models/action-modal';
import { AlertTypesStore } from '../../stores/alert-type.store';

@Component({
  selector: 'app-alert-types',
  standalone: true,
  imports: [
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './alert-types.component.html',
  styleUrl: './alert-types.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertTypesComponent {
  public readonly store = inject(AlertTypesStore);
  public readonly columnsToDisplay = ['id', 'code', 'description', 'actions'];
  private readonly dialog = inject(MatDialog);

  public openCreateModal(): void {
    const alertType = { id: -1, code: '', description: '' };
    this.dialog.open(AlertTypeComponent, {
      data: { type: ActionModal.create, alertType },
      width: '90vw',
      maxWidth: '650px',
    });
  }

  public openEditModal(id: number): void {
    this.store.setAlertType(id);
    const alertType = this.store.selectedEntity();
    const dialogRef = this.dialog.open(AlertTypeComponent, {
      data: { type: ActionModal.update, alertType },
      width: '90vw',
      maxWidth: '650px',
    });
  }

  public openDeleteModal(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: '¿Desea eliminar el tipo de alerta?',
      width: '90vw',
      maxWidth: '650px',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.store.deleteAlertType(id);
      }
    });
  }
}
