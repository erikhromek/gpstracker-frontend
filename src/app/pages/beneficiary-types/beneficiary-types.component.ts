import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { BeneficiaryTypeService } from '../../services/beneficiary-type.service';
import { BeneficiaryType } from '../../models/beneficiary-type';
import { CommonModule } from '@angular/common';

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
  isLoading$ = new BehaviorSubject<boolean>(true);
  beneficiaryTypes$!: Observable<BeneficiaryType[]>;

  columnsToDisplay = ['id', 'code', 'description', 'actions'];

  constructor(private beneficiaryTypeService: BeneficiaryTypeService) {}

  ngOnInit(): void {
    this.getBeneficiaryTypes();
  }

  private getBeneficiaryTypes(): void {
    this.beneficiaryTypes$ = this.beneficiaryTypeService
      .getBeneficiaryTypes()
      .pipe(
        finalize(() => {
          this.isLoading$.next(false);
        })
      );
  }
}
