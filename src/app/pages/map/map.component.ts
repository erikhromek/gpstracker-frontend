import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnInit,
} from '@angular/core';
import * as L from 'leaflet';
import { MatListModule } from '@angular/material/list';
import { Observable, tap } from 'rxjs';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Icon, Marker, icon, latLng, marker, tileLayer } from 'leaflet';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import { Alert, AlertState } from '../../models/alert';
import { MatDialog } from '@angular/material/dialog';
import { AlertAttendComponent } from '../../components/alert-attend/alert-attend.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MatListModule, LeafletModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
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
  alerts$!: Observable<Alert[]>;
  alertStates = AlertState;

  constructor(
    private alertService: AlertService,
    private dialog: MatDialog,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.getAlerts();
  }

  onMapReady(map: L.Map) {
    this.map = map;
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
    const iconUrlMarkerGrey = 'assets/images/marker-grey.png';
    const iconUrlMarkerRed = 'assets/images/marker-red.png';
    const iconUrlMarkerOrange = 'assets/images/marker-orange.png';
    const notificationSoundUrl = 'assets/sounds/sound-alert.mp3';

    alerts.forEach((alert) => {
      let iconUrl =
        alert.state === AlertState.N
          ? iconUrlMarkerRed
          : AlertState.A
          ? iconUrlMarkerOrange
          : iconUrlMarkerGrey;

      let alertMarker = marker([alert.latitude, alert.longitude], {
        icon: icon({
          ...Icon.Default.prototype.options,
          iconUrl: iconUrl,
          iconRetinaUrl: iconUrl,
          shadowUrl: undefined,
        }),
      });

      this.layers.push(alertMarker);

      alertMarker.on('click', () => {
        this.zone.run(() => {
          const dialogRef = this.dialog.open(AlertAttendComponent, {
            data: alert,
            width: '90vw',
            maxWidth: '650px',
          });
        });
      });

      setTimeout(() => {
        const audio = new Audio(notificationSoundUrl);
        audio.play();

        this.map.setView([alerts[0].latitude, alerts[0].longitude]);
      }, 1000);
    });
  }
}
