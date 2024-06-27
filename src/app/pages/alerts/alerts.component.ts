import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BeneficiaryCompanyPipe } from '../../pipes/beneficiary-company.pipe';
import { BeneficiaryTypePipe } from '../../pipes/beneficiary-type.pipe';
import { Alert } from '../../models/alert';
import { MatListModule } from '@angular/material/list';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { tileLayer, latLng, Marker, marker, Icon, icon } from 'leaflet';
import {
  ExportType,
  MatTableExporterDirective,
  MatTableExporterModule,
} from 'mat-table-exporter';
import { AlertsStore } from '../../stores/alert.store';

@Component({
  selector: 'app-alerts',
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
    MatListModule,
    LeafletModule,
    MatTableExporterModule,
  ],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertsComponent {
  public readonly store = inject(AlertsStore);
  public readonly options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
      }),
    ],
    zoom: 14,
    center: latLng(-34.92053826324929, -57.95286763580453),
  };
  public layers: Marker[] = [];
  private map!: L.Map;
  public readonly columnsToDisplay = [
    'id',
    'datetime',
    'beneficiary',
    'location',
    'datetime_attended',
    'observations',
    'actions',
  ];
  public dataSource = new MatTableDataSource<Alert>(this.store.entities());
  @ViewChild('exporter') exporter!: MatTableExporterDirective;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.store.getAlerts();

    effect(() => {
      this.dataSource.data = this.store.entities();
      this.map.invalidateSize();
    });
  }

  ngAfterViewInit() {
    this.setTableAddons();
  }

  private setTableAddons(): void {
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = (data: Alert, filter: string) => {
      return data.telephone.toLowerCase().startsWith(filter);
    };
  }

  public onMapReady(map: L.Map): void {
    this.map = map;
  }

  public filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
    this.layers.splice(0);
    this.store.setSelectedEntity(null);
  }

  public showMarker(alert: Alert): void {
    const iconUrlMarkerRed = 'assets/images/marker-red.png';

    let alertMarker = marker([alert.latitude, alert.longitude], {
      icon: icon({
        ...Icon.Default.prototype.options,
        iconUrl: iconUrlMarkerRed,
        iconRetinaUrl: iconUrlMarkerRed,
        shadowUrl: undefined,
      }),
    });

    this.layers.splice(0);
    this.layers.push(alertMarker);
    this.map.setView(latLng(alert.latitude, alert.longitude), 14);
    this.store.setSelectedEntity(alert.id);
  }

  public exportAlerts(): void {
    this.exporter.exportTable(ExportType.CSV, {
      fileName: 'Alertas',
    });
  }
}
