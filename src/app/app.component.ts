import { Component, OnInit } from '@angular/core';
import { AuthUser } from './models/auth_user';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'gpstracker-frontend';

    /**
   * An object representing the user for the login form
   */
    public user?: AuthUser;
 
    constructor(private _authService: AuthService) { }
   
    ngOnInit() {
      this.user = {
        email: '',
        password: ''
      };
    }
   
    login() {
      this._authService.login(this.user);
    }
   
    refreshToken() {
      this._authService.refreshToken();
    }
   
    logout() {
      this._authService.logout();
    }

}
