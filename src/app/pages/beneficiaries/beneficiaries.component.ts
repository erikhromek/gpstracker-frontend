import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { ActionModal } from '../../models/action-modal';
import { BeneficiaryComponent } from '../../components/beneficiary/beneficiary.component';
import { BeneficiaryTypePipe } from '../../pipes/beneficiary-type.pipe';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { BeneficiaryCompanyPipe } from '../../pipes/beneficiary-company.pipe';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BeneficiariesStore } from '../../stores/beneficiary.store';
import { BeneficiaryTypesStore } from '../../stores/beneficiary-type.store';
import { Beneficiary } from '../../models/beneficiary';

@Component({
  selector: 'app-beneficiaries',
  standalone: true,
  imports: [
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    BeneficiaryTypePipe,
    MatPaginator,
    BeneficiaryCompanyPipe,
    MatFormField,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
  ],
  templateUrl: './beneficiaries.component.html',
  styleUrl: './beneficiaries.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeneficiariesComponent {
  public readonly store = inject(BeneficiariesStore);
  public readonly storeBeneficiaryTypes = inject(BeneficiaryTypesStore);
  private readonly dialog = inject(MatDialog);
  public readonly columnsToDisplay = [
    'id',
    'name',
    'surname',
    'telephone',
    'description',
    'typeId',
    'company',
    'enabled',
    'actions',
  ];
  public dataSource = new MatTableDataSource<Beneficiary>(
    this.store.entities(),
  );
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    effect(() => {
      this.dataSource.data = this.store.entities();
    });
  }

  ngAfterViewInit() {
    this.setTableAddons();
  }

  private setTableAddons(): void {
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = (data: Beneficiary, filter: string) => {
      return data.telephone.toLowerCase().startsWith(filter);
    };
  }

  public filterTable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  public openCreateModal(): void {
    const beneficiary = {
      id: -1,
      name: '',
      surname: '',
      telephone: '',
      enabled: true,
      typeId: null as unknown as number,
      company: '',
      description: '',
    };
    this.dialog.open(BeneficiaryComponent, {
      data: {
        type: ActionModal.create,
        beneficiaryTypes: this.storeBeneficiaryTypes.entities(),
        beneficiary,
      },
      width: '90vw',
      maxWidth: '650px',
    });
  }

  public openEditModal(id: number): void {
    this.store.setBeneficiary(id);
    const beneficiary = this.store.selectedEntity();
    this.dialog.open(BeneficiaryComponent, {
      data: {
        action: ActionModal.update,
        beneficiaryTypes: this.storeBeneficiaryTypes.entities(),
        beneficiary,
      },
      width: '90vw',
      maxWidth: '650px',
    });
  }

  public toggleBeneficiary(id: number, enabled: boolean): void {
    const message = enabled
      ? '¿Desea desactivar el beneficiario?'
      : '¿Desea reactivar el beneficiario?';
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: message,
      width: '90vw',
      maxWidth: '650px',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.store.setBeneficiary(id);
        this.store.toggleBeneficiary(id);
      }
    });
  }
}
