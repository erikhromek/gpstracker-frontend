import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthUser } from '../models/auth_user';
import { environment } from '../../environments/environment';
import { AuthToken } from '../models/auth_token';

@Injectable()
export class AuthService {
  apiUrl = `${environment.apiUrl}/api`;

  // http options used for making API calls
  httpOptions: any;

  public access?: string;
  refresh?: string;

  // the token expiration date
  public expiration?: Date;

  // error messages received from the login attempt
  public errors: any = [];

  constructor(private httpClient: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  }

  public login(user: AuthUser) {
    this.httpClient
      .post<AuthToken>(`${this.apiUrl}/token/`, user)
      .subscribe({next: (v) => this.updateData(v), error: (e) => this.errors = e['detail']});
  }

  // Refreshes the JWT token, to extend the time the user is logged in
  public refreshToken() {
    this.httpClient
      .post<AuthToken>(`${this.apiUrl}/token/`, this.refresh)
      .subscribe({next: (v) => this.updateData(v), error: (e) => this.errors = e['detail']});
  }

  public logout() {
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
