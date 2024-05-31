import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';
import {MatListModule} from '@angular/material/list';
import { NgOptimizedImage } from '@angular/common';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MatIconModule, MatMenuModule, MatButtonModule, RouterLink, MatListModule, NgOptimizedImage],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {

  private map!: L.Map;

  private initMap(): void {
    this.map = new L.Map('map', {
      center: [ -34.92053826324929, -57.95286763580453 ],
      zoom: 14
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }


}
