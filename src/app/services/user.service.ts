import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClient) {}

  getProfile(): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/users/details/`);
  }

  updateProfile(user: User): Observable<User> {
    return this.httpClient.patch<User>(
      `${this.apiUrl}/users/${user.id}/`,
      user
    );
  }
}
