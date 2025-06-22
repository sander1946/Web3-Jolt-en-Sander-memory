import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiService: ApiService;
  constructor() {
    this.apiService = new ApiService();
  }

  async submitLogin(username: string, password: string) {
    let result = await this.apiService.adminLogin(
      username,
      password
    )
    if (result) {
      console.log('Login successful');
      // Redirect to the home page or dashboard after successful login
      window.location.href = '/dashboard';
    } else {
      console.error('Login failed');
      // Handle login failure (e.g., show an error message)
      alert('Login failed. Please check your credentials and try again.');
    }
  }
}
