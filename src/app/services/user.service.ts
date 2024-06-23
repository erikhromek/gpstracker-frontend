import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private readonly httpClient = inject(HttpClient);

  public getProfile(): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/users/details/`);
  }

  public updateProfile(user: User): Observable<User> {
    return this.httpClient.patch<User>(
      `${this.apiUrl}/users/${user.id}/`,
      user,
    );
  }
}
