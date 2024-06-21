import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewChild,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  finalize,
  forkJoin,
  map,
  tap,
} from 'rxjs';
import { BeneficiaryTypeService } from '../../services/beneficiary-type.service';
import { BeneficiaryType } from '../../models/beneficiary-type';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { ActionModal } from '../../models/action-modal';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { Beneficiary, BeneficiaryCompany } from '../../models/beneficiary';
import { BeneficiaryComponent } from '../../components/beneficiary/beneficiary.component';
import { BeneficiaryTypePipe } from '../../pipes/beneficiary-type.pipe';
import { MatPaginator } from '@angular/material/paginator';
import { BeneficiaryCompanyPipe } from '../../pipes/beneficiary-company.pipe';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
  ],
  templateUrl: './beneficiaries.component.html',
  styleUrl: './beneficiaries.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeneficiariesComponent {
  private destroyRef = inject(DestroyRef);

  isLoading$ = new BehaviorSubject<boolean>(true);

  beneficiaryTypes: BeneficiaryType[] = [];

  beneficiaries$!: Observable<Beneficiary[]>;
  beneficiaryTypes$!: Observable<BeneficiaryType[]>;

  columnsToDisplay = [
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

  private filterSubject = new BehaviorSubject<string>('');
  public filteredData$!: Observable<Beneficiary[]>;

  constructor(
    private beneficiaryTypeService: BeneficiaryTypeService,
    private beneficiaryService: BeneficiaryService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getBeneficiaries();
  }

  public getBeneficiaries(): void {
    this.isLoading$.next(true); // FIXME por qué es necesario esto?
    this.beneficiaries$ = this.beneficiaryService.getBeneficiaries();
    this.beneficiaryTypes$ = this.beneficiaryTypeService.getBeneficiaryTypes();

    forkJoin([this.beneficiaries$, this.beneficiaryTypes$])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((beneficiariesData) => {
          this.beneficiaryTypes = beneficiariesData[1]; // TODO revisar si la implementación es correcta
        }),
        finalize(() => {
          this.isLoading$.next(false);
        }),
      )
      .subscribe();

    this.filteredData$ = combineLatest([
      this.beneficiaries$,
      this.filterSubject,
    ]).pipe(
      map(([data, filter]) =>
        data.filter((item) =>
          item.telephone.toLowerCase().includes(filter.toLowerCase()),
        ),
      ),
    );
  }

  filterTable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.filterSubject.next(filterValue);
  }

  openCreateModal(): void {
    const beneficiary = {
      id: -1,
      name: '',
      surname: '',
      telephone: '',
      enabled: true,
      typeId: null as unknown as number,
      company: 'OTH',
      description: '',
    };
    const dialogRef = this.dialog.open(BeneficiaryComponent, {
      data: {
        type: ActionModal.create,
        beneficiaryTypes: this.beneficiaryTypes,
        beneficiary,
      },
      width: '90vw',
      maxWidth: '650px',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getBeneficiaries();
      }
    });
  }

  openEditModal(id: number): void {
    this.beneficiaryService
      .getBeneficiary(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((beneficiary: Beneficiary) => {
        const dialogRef = this.dialog.open(BeneficiaryComponent, {
          data: {
            type: ActionModal.update,
            beneficiaryTypes: this.beneficiaryTypes,
            beneficiary,
          },
          width: '90vw',
          maxWidth: '650px',
        });
        dialogRef.afterClosed().subscribe((result: boolean) => {
          if (result) {
            this.getBeneficiaries();
          }
        });
      });
  }

  openDeleteModal(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: '¿Desea desactivar el beneficiario?',
      width: '90vw',
      maxWidth: '650px',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.beneficiaryService.disableBeneficiary(id).subscribe(() => {
          this.getBeneficiaries();
        });
      }
    });
  }
  openEnableModal(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: '¿Desea reactivar el beneficiario?',
      width: '90vw',
      maxWidth: '650px',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.beneficiaryService.enableBeneficiary(id).subscribe(() => {
          this.getBeneficiaries();
        });
      }
    });
  }
}
