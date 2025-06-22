import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  constructor() {
    // You can add any initialization logic here if needed
  }

  logout() {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    // Optionally, redirect to the login page
    window.location.href = '/login';
  }

  isLoggedIn(): boolean {
    // Check if the token exists in localStorage
    return !!localStorage.getItem('token');
  }
}
