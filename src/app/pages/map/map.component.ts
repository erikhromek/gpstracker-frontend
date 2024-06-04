import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MatListModule } from '@angular/material/list';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MatListModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {
  apiUrl = `${environment.apiUrl}`;
  private map!: L.Map;

  private initMap(): void {
    this.map = new L.Map('map', {
      center: [-34.92053826324929, -57.95286763580453],
      zoom: 14,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);
  }

  constructor(private httpClient: HttpClient) {}

  private tryGet(): void {
    this.httpClient
    .get<any[]>(`${this.apiUrl}/alerts-summary/`)
    .subscribe(
      (data: any[]) => {
        console.log("ok");
      }
    );
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.tryGet();
  }
}
