import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from '../profile/profile.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class LayoutComponent {
  private destroyRef = inject(DestroyRef);

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  openProfile(): void {
    this.userService
      .getProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user: User) => {
        this.dialog.open(ProfileComponent, {
          data: user,
          width: '90vw',
          maxWidth: '650px',
        });
      });
  }
}
