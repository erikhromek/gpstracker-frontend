import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterLink,
    MatListModule,
    NgOptimizedImage,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
