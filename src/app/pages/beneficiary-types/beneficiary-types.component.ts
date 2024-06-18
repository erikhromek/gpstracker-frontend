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
import { BeneficiaryTypeService } from '../../services/beneficiary-type.service';
import { BeneficiaryType } from '../../models/beneficiary-type';
import { CommonModule } from '@angular/common';
import { BeneficiaryTypeComponent } from '../../components/beneficiary-type/beneficiary-type.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { ActionModal } from '../../models/action-modal';

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
  private destroyRef = inject(DestroyRef);

  isLoading$ = new BehaviorSubject<boolean>(true);
  beneficiaryTypes$!: Observable<BeneficiaryType[]>;

  columnsToDisplay = ['id', 'code', 'description', 'actions'];

  constructor(
    private beneficiaryTypeService: BeneficiaryTypeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getBeneficiaryTypes();
  }

  public getBeneficiaryTypes(): void {
    this.isLoading$.next(true); // FIXME por qué es necesario esto?
    this.beneficiaryTypes$ = this.beneficiaryTypeService
      .getBeneficiaryTypes()
      .pipe(
        finalize(() => {
          this.isLoading$.next(false);
        })
      );
  }

  openCreateModal(): void {
    const beneficiaryType = { id: -1, code: '', description: '' };
    const dialogRef = this.dialog.open(BeneficiaryTypeComponent, {
      data: { type: ActionModal.create, beneficiaryType },
      width: '90vw',
      maxWidth: '650px',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getBeneficiaryTypes();
      }
    });
  }

  openEditModal(id: number): void {
    this.beneficiaryTypeService
      .getBeneficiaryType(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((beneficiaryType: BeneficiaryType) => {
        const dialogRef = this.dialog.open(BeneficiaryTypeComponent, {
          data: { type: ActionModal.update, beneficiaryType },
          width: '90vw',
          maxWidth: '650px',
        });
        dialogRef.afterClosed().subscribe((result: boolean) => {
          if (result) {
            this.getBeneficiaryTypes();
          }
        });
      });
  }

  openDeleteModal(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: '¿Desea eliminar el tipo de beneficiario?',
      width: '90vw',
      maxWidth: '650px',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.beneficiaryTypeService.deleteBeneficiaryType(id).subscribe(() => {
          this.getBeneficiaryTypes();
        });
      }
    });
  }
}
