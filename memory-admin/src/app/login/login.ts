import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginService: LoginService = inject(LoginService);
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  submitLogin() {
    this.loginService.submitLogin(
      this.loginForm.value.username ?? '',
      this.loginForm.value.password ?? '',
    );
  }
}
