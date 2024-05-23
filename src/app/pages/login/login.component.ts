import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [AuthService],
  imports: [FormsModule, CommonModule, HttpClientModule, MatCardModule, MatFormFieldModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
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
