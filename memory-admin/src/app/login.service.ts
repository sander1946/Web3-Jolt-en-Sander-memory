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
    this.setInputBorder(false);
    if (!username || !password) {
      console.error('Username and password are required');
      this.setInputBorder(true, 'Please fill in both username and password');
      return;
    }
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
      this.setInputBorder(true, 'Invalid username or password');
    }
  }

  setInputBorder(enabled = true, message = '') {
    let inputs = document.querySelectorAll('input');
    let errorElement = document.getElementById('error');
    if (!inputs || inputs.length === 0) {
      console.error('No input elements found');
      return;
    }

    if (!errorElement) {
      console.error('Error element not found');
      return;
    }

    if (enabled) {
      inputs.forEach(input => {
        input.style.border = '2px solid #F00';
      });
      errorElement.innerHTML = message;
      errorElement.style.display = 'flex';
      return;
    }

    inputs.forEach(input => {
      input.style.border = 'none';
    });
    if (message !== '') {
      errorElement.innerHTML = message;
      errorElement.style.display = 'flex';
    }
    else {
      errorElement.innerHTML = '';
      errorElement.style.display = 'none';
    }
  }
}
