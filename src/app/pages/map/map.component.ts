import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MatListModule } from '@angular/material/list';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {
  Icon,
  Marker,
  circle,
  icon,
  latLng,
  marker,
  polygon,
  tileLayer,
} from 'leaflet';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import { Alert } from '../../models/alert';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MatListModule, LeafletModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  apiUrl = `${environment.apiUrl}`;
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
  alerts$!: Observable<Alert[]>;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.getAlerts();
  }

  private getAlerts(): void {
    this.alerts$ = this.alertService.getAlerts().pipe(
      tap((alerts: Alert[]) => {
        if (alerts) {
          this.assignMarkers(alerts);
        }
      })
    );
  }

  private assignMarkers(alerts: Alert[]): void {
    alerts.forEach((alert) => {
      let alertMarker = marker([alert.latitude, alert.longitude], {
        icon: icon({
          ...Icon.Default.prototype.options,
          iconUrl: 'assets/marker-icon.png',
          iconRetinaUrl: 'assets/marker-icon-2x.png',
          shadowUrl: 'assets/marker-shadow.png',
        }),
      });

      alertMarker.bindPopup(`<div>${alert.id}</div>`);
      this.layers.push(alertMarker);
    });
  }
}
