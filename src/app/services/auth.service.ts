import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthUser } from '../models/auth-user';
import { environment } from '../../environments/environment';
import { AuthToken } from '../models/auth-token';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  apiUrl = `${environment.apiUrl}/api`;

  constructor(private httpClient: HttpClient) {}

  login(user: AuthUser): Observable<AuthToken> {
    return this.httpClient.post<AuthToken>(`${this.apiUrl}/token/`, user).pipe(
      tap((authToken: AuthToken) => {
        this.setSession(authToken);
      })
    );
  }

  private setSession(authToken: AuthToken): void {
    localStorage.setItem('access', authToken.access);
    localStorage.setItem('refresh', authToken.refresh);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('access') ? true : false;
  }

  logout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  refreshToken(): Observable<AuthToken> {
    return this.httpClient
      .post<AuthToken>(`${this.apiUrl}/token/refresh/`, {
        refresh: this.getRefreshToken(),
      })
      .pipe(
        tap((authToken: AuthToken) => {
          this.setSession(authToken);
        })
      );
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh');
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('access');
  }
}
