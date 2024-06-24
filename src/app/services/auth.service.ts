import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthUser } from '../models/auth-user';
import { environment } from '../../environments/environment';
import { AuthToken } from '../models/auth-token';
import { Observable, tap } from 'rxjs';
import { RegisterUser } from '../models/register-user';
import { CreatedUser } from '../models/created-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private readonly httpClient = inject(HttpClient);

  public login(user: AuthUser): Observable<AuthToken> {
    return this.httpClient.post<AuthToken>(`${this.apiUrl}/token/`, user);
  }

  public register(user: RegisterUser): Observable<CreatedUser> {
    return this.httpClient.post<RegisterUser>(
      `${this.apiUrl}/users/admin/`,
      user,
    );
  }

  public refreshToken(): Observable<AuthToken> {
    return this.httpClient.post<AuthToken>(`${this.apiUrl}/token/refresh/`, {
      refresh: this.getRefreshToken(),
    });
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh');
  }
}
