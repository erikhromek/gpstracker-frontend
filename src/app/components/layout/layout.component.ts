import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { NgOptimizedImage } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from '../profile/profile.component';
import { UsersStore } from '../../stores/user.store';
import { AuthStore } from '../../stores/auth.store';

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
    RouterLinkActive,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  private readonly userStore = inject(UsersStore);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  logout(): void {
    this.authStore.logout();
    this.router.navigateByUrl('/login');
  }

  openProfile(): void {
    const user = this.userStore.selectedEntity();
    this.dialog.open(ProfileComponent, {
      data: user,
      width: '90vw',
      maxWidth: '650px',
    });
  }
}
