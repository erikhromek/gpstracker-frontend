import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Icon, Map, Marker, icon, latLng, marker, tileLayer } from 'leaflet';
import { CommonModule } from '@angular/common';
import { Alert, AlertState } from '../../models/alert';
import { MatDialog } from '@angular/material/dialog';
import { AlertAttendComponent } from '../../components/alert-attend/alert-attend.component';
import { AlertsStore } from '../../stores/alert.store';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    LeafletModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnDestroy {
  public readonly store = inject(AlertsStore);
  public readonly isProduction = signal(environment.production);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
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
  private map!: Map;
  public AlertState = AlertState;
  private readonly iconUrlMarkerGrey = 'assets/images/marker-grey.png';
  private readonly iconUrlMarkerRed = 'assets/images/marker-red.png';
  private readonly iconUrlMarkerOrange = 'assets/images/marker-orange.png';
  private readonly notificationSoundUrl = 'assets/sounds/sound-alert.mp3';

  constructor() {
    if (!this.isProduction()) {
      this.store.getAlerts();
    } else {
      this.store.getAlertsSummary();
    }

    this.store.connectToWebSocket();
    let isLoaded = false;

    effect(() => {
      const createdAlert = this.store.createdEntity();

      if (createdAlert) {
        this.createMarker(createdAlert);
        this.playNotificationSound();
        this.map.setView([createdAlert.latitude, createdAlert.longitude]);
        this.createSnackbar('Nueva alerta recibida');
      }
    });

    effect(() => {
      const updatedAlert = this.store.updatedEntity();

      if (updatedAlert) {
        this.updateMarker(updatedAlert);
        const message =
          updatedAlert.state === AlertState.C
            ? 'Alerta cerrada'
            : 'Alerta atendida';
        this.createSnackbar(message);
      }
    });

    effect(() => {
      const alerts = this.store.sortedEntities();
      const isPending = this.store.isPending();

      if (isLoaded == false && isPending == false) {
        isLoaded = true;
        alerts.forEach((alert) => {
          this.createMarker(alert);
        });
      }

      this.map.invalidateSize();
    });
  }

  ngOnDestroy(): void {
    this.store.disconnectFromWebSocket();
  }

  public onMapReady(map: Map): void {
    this.map = map;
  }

  public async createAlertsDummies(): Promise<void> {
    await this.store.createAlertsDummies();
  }

  private playNotificationSound(): void {
    const audio = new Audio(this.notificationSoundUrl);
    const promiseAudioPlay = audio.play();

    if (promiseAudioPlay !== undefined) {
      promiseAudioPlay
        .then(() => {})
        .catch(() => {
          this.createSnackbar(
            'Se requiere tener habilitada la reproducción automática de sonido para la recepción de alertas',
          );
        });
    }
  }

  private createSnackbar(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: 'snackbar-notification',
    });
  }

  private getIconUrl(alert: Alert): Icon {
    const iconUrl =
      alert.state === AlertState.N
        ? this.iconUrlMarkerRed
        : alert.state === AlertState.A
          ? this.iconUrlMarkerOrange
          : this.iconUrlMarkerGrey;

    return icon({
      ...Icon.Default.prototype.options,
      iconUrl: iconUrl,
      iconRetinaUrl: iconUrl,
      shadowUrl: undefined,
    });
  }

  private updateMarker(alert: Alert): void {
    const marker = this.layers.find(
      (marker) => marker.options.title === alert.id.toString(),
    );
    marker?.setIcon(this.getIconUrl(alert));
  }

  private createMarker(alert: Alert): void {
    const alertMarker = marker([alert.latitude, alert.longitude], {
      title: alert.id.toString(),
      icon: this.getIconUrl(alert),
    });

    this.layers.push(alertMarker);

    alertMarker.on('click', () => {
      this.store.setSelectedEntity(alert.id);
      const alertFromStore = this.store.selectedEntity();

      this.dialog.open(AlertAttendComponent, {
        data: alertFromStore,
        width: '90vw',
        maxWidth: '650px',
      });
    });
  }
}
