import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [AuthService],
  imports: [FormsModule, BrowserModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  /**
   * An object representing the user for the login form
   */
  protected user: any;
 
  constructor(protected _authService: AuthService) { }
 
  ngOnInit() {
    this.user = {
      email: '',
      password: ''
    };
  }
 
  login() {
    this._authService.login({'email': this.user.email, 'password': this.user.password});
  }
 
  refreshToken() {
    this._authService.refreshToken();
  }
 
  logout() {
    this._authService.logout();
  }

}
