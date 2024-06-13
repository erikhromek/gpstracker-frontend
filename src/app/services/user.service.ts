import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { UpdateUser } from '../models/update-user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClient) {}

  getProfile(): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/users/details/`);
  }

  updateProfile(id: number, user: UpdateUser): Observable<User> {
    return this.httpClient.patch<User>(`${this.apiUrl}/users/${id}/`, user);
  }
}
