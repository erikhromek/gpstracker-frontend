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
    return this.httpClient.post<AuthToken>(`${this.apiUrl}/token/`, user).pipe(
      tap((authToken: AuthToken) => {
        this.setSession(authToken);
      }),
    );
  }

  public register(user: RegisterUser): Observable<CreatedUser> {
    return this.httpClient.post<RegisterUser>(
      `${this.apiUrl}/users/admin/`,
      user,
    );
  }

  private setSession(authToken: AuthToken): void {
    localStorage.setItem('access', authToken.access);
    localStorage.setItem('refresh', authToken.refresh);
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem('access') ? true : false;
  }

  public logout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  public refreshToken(): Observable<AuthToken> {
    return this.httpClient
      .post<AuthToken>(`${this.apiUrl}/token/refresh/`, {
        refresh: this.getRefreshToken(),
      })
      .pipe(
        tap((authToken: AuthToken) => {
          this.setSession(authToken);
        }),
      );
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem('refresh');
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('access');
  }
}
