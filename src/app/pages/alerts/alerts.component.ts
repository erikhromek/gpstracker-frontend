import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import {
  BehaviorSubject,
  Observable,
  finalize,
  combineLatest,
  map,
} from 'rxjs';
import { BeneficiaryCompanyPipe } from '../../pipes/beneficiary-company.pipe';
import { BeneficiaryTypePipe } from '../../pipes/beneficiary-type.pipe';
import { Alert } from '../../models/alert';
import { AlertService } from '../../services/alert.service';
import { MatListModule } from '@angular/material/list';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { tileLayer, latLng, Marker, marker, Icon, icon } from 'leaflet';
import {
  ExportType,
  MatTableExporterDirective,
  MatTableExporterModule,
} from 'mat-table-exporter';

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
export class AlertsComponent implements OnInit {
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
      }),
    ],
    zoom: 14,
    center: latLng(-34.92053826324929, -57.95286763580453),
  };
  layers: Marker[] = [];
  map!: L.Map;

  isLoading$ = new BehaviorSubject<boolean>(true);
  alerts$!: Observable<Alert[]>;

  clickedAlertId: number = -1;

  columnsToDisplay = [
    'id',
    'datetime',
    'beneficiary',
    'location',
    'datetime_attended',
    'observations',
    'actions',
  ];

  private filterSubject = new BehaviorSubject<string>('');
  public filteredData$!: Observable<Alert[]>;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.getAlerts();
  }

  onMapReady(map: L.Map) {
    this.map = map;
  }

  public getAlerts(): void {
    this.isLoading$.next(true); // FIXME por qué es necesario esto?
    this.alerts$ = this.alertService.getAlerts().pipe(
      finalize(() => {
        this.isLoading$.next(false);
      }),
    );

    this.filteredData$ = combineLatest([this.alerts$, this.filterSubject]).pipe(
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

    this.layers.splice(0);
    this.clickedAlertId = -1;
  }

  showMarker(alert: Alert) {
    const iconUrlMarkerRed = 'assets/images/marker-red.png';

    let alertMarker = marker([alert.latitude, alert.longitude], {
      icon: icon({
        ...Icon.Default.prototype.options,
        iconUrl: iconUrlMarkerRed,
        iconRetinaUrl: iconUrlMarkerRed,
        shadowUrl: undefined,
      }),
    });

    this.layers.push(alertMarker);
    this.map.setView(latLng(alert.latitude, alert.longitude), 14);
    this.clickedAlertId = alert.id;
  }

  @ViewChild('exporter') exporter!: MatTableExporterDirective;
  exportAlerts() {
    this.exporter.exportTable(ExportType.CSV, {
      fileName: 'Alertas',
    });
  }
}
