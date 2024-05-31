import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthUser } from '../models/auth-user';
import { environment } from '../../environments/environment';
import { AuthToken } from '../models/auth-token';
import { tap } from 'rxjs';

@Injectable()
export class AuthService {
  apiUrl = `${environment.apiUrl}/api`;

  authToken?:

  // the token expiration date
  expiration?: Date;

  // error messages received from the login attempt
  errors: any = [];

  constructor(private httpClient: HttpClient) {
  }

  login(user: AuthUser) {
    this.httpClient
      .post<AuthToken>(`${this.apiUrl}/token/`, user)
      .pipe(tap( (authToken: AuthToken => {this.authToken = authToken} )));
  }

  // Refreshes the JWT token, to extend the time the user is logged in
  refreshToken() {
    this.httpClient
      .post<AuthToken>(`${this.apiUrl}/token/`, this.refresh)
      .subscribe({next: (v) => this.updateData(v), error: (e) => this.errors = e['detail']});
  }

  logout() {
    this.access = undefined;
    this.refresh = undefined;
    this.expiration = undefined;
  }

  private updateData(token: AuthToken) {
    this.access = token.access;
    if (token.refresh !== undefined)
        this.refresh = token.refresh;
    else
        this.refresh = undefined;
    this.errors = [];

    const token_parts = this.access.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.expiration = new Date(token_decoded.exp * 1000);
  }
}
