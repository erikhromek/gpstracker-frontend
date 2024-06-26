import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  private route = inject(ActivatedRoute);
  public error = signal<HttpErrorResponse>({} as HttpErrorResponse);

  ngOnInit(): void {
    this.createError();
  }

  private createError(): void {
    let errorCode: number;
    let error: HttpErrorResponse;

    if (Number(this.route.snapshot.paramMap.get('code'))) {
      errorCode = Number(this.route.snapshot.paramMap.get('code'));
    } else {
      errorCode = 404;
    }

    switch (errorCode) {
      case 400:
        error = new HttpErrorResponse({
          error: 'Bad Request',
          status: errorCode,
        });
        break;
      case 401:
        error = new HttpErrorResponse({
          error: 'Unauthorized',
          status: errorCode,
        });
        break;
      case 403:
        error = new HttpErrorResponse({
          error: 'Forbidden',
          status: errorCode,
        });
        break;
      case 429:
        error = new HttpErrorResponse({
          error: 'Too Many Request',
          status: errorCode,
        });
        break;
      case 500:
        error = new HttpErrorResponse({
          error: 'Internal Server Error',
          status: errorCode,
        });
        break;
      case 502:
        error = new HttpErrorResponse({
          error: 'Bad Gateway',
          status: errorCode,
        });
        break;
      case 503:
        error = new HttpErrorResponse({
          error: 'Service unavailable',
          status: errorCode,
        });
        break;
      default:
        error = new HttpErrorResponse({
          error: 'Not Found',
          status: 404,
        });
        break;
    }

    this.error.set(error);
  }
}
