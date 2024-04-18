import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserService } from './auth.service';


@NgModule({
  declarations: [AuthComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],    // add this
  providers: [UserService],    // add this
})
export class AuthModule { }
