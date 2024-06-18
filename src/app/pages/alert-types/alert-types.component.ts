import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { AlertTypeService } from '../../services/alert-type.service';
import { AlertType } from '../../models/alert-type';
import { CommonModule } from '@angular/common';
import { AlertTypeComponent } from '../../components/alert-type/alert-type.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { ActionModal } from '../../models/action-modal';

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
  private destroyRef = inject(DestroyRef);

  isLoading$ = new BehaviorSubject<boolean>(true);
  alertTypes$!: Observable<AlertType[]>;

  columnsToDisplay = ['id', 'code', 'description', 'actions'];

  constructor(
    private alertTypeService: AlertTypeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAlertTypes();
  }

  public getAlertTypes(): void {
    this.isLoading$.next(true); // FIXME por qué es necesario esto?
    this.alertTypes$ = this.alertTypeService.getAlertTypes().pipe(
      finalize(() => {
        this.isLoading$.next(false);
      })
    );
  }

  openCreateModal(): void {
    const alertType = { id: -1, code: '', description: '' };
    const dialogRef = this.dialog.open(AlertTypeComponent, {
      data: { type: ActionModal.create, alertType },
      width: '90vw',
      maxWidth: '650px',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getAlertTypes();
      }
    });
  }

  openEditModal(id: number): void {
    this.alertTypeService
      .getAlertType(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((alertType: AlertType) => {
        const dialogRef = this.dialog.open(AlertTypeComponent, {
          data: { type: ActionModal.update, alertType },
          width: '90vw',
          maxWidth: '650px',
        });
        dialogRef.afterClosed().subscribe((result: boolean) => {
          if (result) {
            this.getAlertTypes();
          }
        });
      });
  }

  openDeleteModal(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: '¿Desea eliminar el tipo de alerta?',
      width: '90vw',
      maxWidth: '650px',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.alertTypeService.deleteAlertType(id).subscribe(() => {
          this.getAlertTypes();
        });
      }
    });
  }
}
