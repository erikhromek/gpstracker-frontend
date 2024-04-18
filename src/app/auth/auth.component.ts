import { Component } from '@angular/core';
import {UserService} from './auth.service';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  /**
   * An object representing the user for the login form
   */
  public user: any;
 
  constructor(private _userService: UserService) { }
 
  ngOnInit() {
    this.user = {
      email: '',
      password: ''
    };
  }
 
  login() {
    this._userService.login({'email': this.user.email, 'password': this.user.password});
  }
 
  refreshToken() {
    this._userService.refreshToken();
  }
 
  logout() {
    this._userService.logout();
  }
}
