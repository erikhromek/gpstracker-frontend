

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AuthUser } from '../models/auth_user';
import { environment } from 'src/environments/environment';
 
@Injectable()
export class AuthService {
 
  apiUrl = `${environment.apiUrl}/api`;

  // http options used for making API calls
  private httpOptions: any;

  private token?: string;
  private refresh_token?: string;
 
  // the token expiration date
  public expiration?: Date;
 
  // error messages received from the login attempt
  public errors: any = [];
 
  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }
 
  // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public login(user: AuthUser) {
    this.http.post(`${this.apiUrl}/token/`, user, this.httpOptions).subscribe(
      data => {
        this.updateData(data['access']);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }
 
  // Refreshes the JWT token, to extend the time the user is logged in
  public refreshToken() {
    this.http.post(`${this.apiUrl}/token/refresh/`, JSON.stringify({token: this.refresh_token}), this.httpOptions).subscribe(
      data => {
        this.updateData(data['access']);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }
 
  public logout() {
    this.token = undefined;
    this.refresh_token = undefined;
    this.expiration = undefined;
  }
 
  private updateData(token: string) {
    this.token = token;
    this.errors = [];
 
    // decode the token to read the username and expiration timestamp
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.expiration = new Date(token_decoded.exp * 1000);
  }
 
}

