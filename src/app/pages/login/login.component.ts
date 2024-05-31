import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthUser } from '../../models/auth-user';
import { validateVerticalPosition } from '@angular/cdk/overlay';
import { EMPTY, catchError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [AuthService],
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', Validators.email],
    password: ['', Validators.required],
  });

  constructor(protected _authService: AuthService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.checkSession();
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  checkSession(): void {
    this._authService.isLoggedIn()? this.router.navigateByUrl("/map") : false;
  }

  submit(): void {
    if (this.loginForm.valid) {
      this._authService.login(this.loginForm.value as AuthUser).pipe(catchError((error) => {
        console.log(error);
        return EMPTY;
      })).subscribe(() => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || "/map";
        this.router.navigateByUrl(returnUrl);
      });


    }
  }
}
