import { Injectable } from '@angular/core';
import { adminAggregate, adminDateMap, adminPlayer, playerData, playerGames, playerPreferences, playerPreferencesUpdate, playerScores } from './api-interfaces';

@Injectable({
  providedIn: 'root',
})

export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:8000'; // Adjust the base URL as needed
  }

  promtToLogin() {
    // Redirect to the login page if the user is not authenticated
    window.location.href = '/login';
  }

  public getAPIToken(): string | null {
    // Retrieve the API token from local storage or any other secure storage
    return localStorage.getItem('token');
  }

  // Overzicht van de spelers en hun gemiddelde score (ongesorteerd)
  async publicGetScores(): Promise<playerScores | null> {
    try {
      let response = await fetch(`${this.baseUrl}/memory/scores`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json() as playerScores;
    } catch (error) {
      console.error('Error fetching scores:', error);
      return null;
    }
  }

  // Lijst van alle spelers met hun beste score (gesorteerd op score, lager is beter)
  async publicGetTopScores(): Promise<playerScores | null> {
    try {
      let response = await fetch(`${this.baseUrl}/memory/top-scores`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json() as playerScores;
    } catch (error) {
      console.error('Error fetching top scores:', error);
      return null
    }
  }

  // Als de credentials kloppen met de speler, komt hier een JWT terug
  private async publicLoginPlayer(username: string, password: string): Promise<string | boolean> {
    try {
      let response = await fetch(`${this.baseUrl}/memory/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"username":username, "password":password}),
      });
      if (response.status === 400) {
        throw new Error('Bad Request: Gegevens kloppen niet met het model');
      }
      else if (response.status === 401) {
        return false; // Invalid credentials
      } 
      else if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let data = await response.json();
      return data.token; // Assuming the token is returned in the response
    } catch (error) {
      console.error('Error logging in player:', error);
      return true; // Return true to indicate an error occurred
    }
  }

  // admin
  // login als admin, deze slaat de token op in localStorage en checkt of de gebruiker een admin is
  async adminLogin(username: string, password: string): Promise<boolean> {
    try {
      let result = await this.publicLoginPlayer(username, password);
      if (typeof result === 'string') {
        localStorage.setItem('token', result); // Store the token in local storage

        // Check if the user is an admin by trying to fetch admin data
        let games = await this.adminGetGames();
        if (games) {
          console.log('Admin login successful:', games);
          return true; // Login successful
        }
        console.error('Admin login failed: No admin data received');
        return false; // Login failed
      } else {
        if (result === true) { // There was an error during login
          console.error('Login failed: An error occurred during login');
        }
        if (result === false) {
          console.error('Login failed: Invalid credentials');
        }
        return false; // Login failed
      }
    } catch (error) {
      console.error('Error during admin login:', error);
      return false; // Return false to indicate an error occurred
    }
  }

  // totaal aantal gespeelde spellen en spelers; overzicht van de gekozen api's
  async adminGetGames(): Promise<adminAggregate | null> {
    try {
      let response = await fetch(`${this.baseUrl}/admin/aggregate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAPIToken()}`, // Include the token in the request headers
        },
      });
      if (response.status === 401) {
        console.error('Unauthorized: Invalid token');
        this.promtToLogin(); // Prompt the user to log in if the token is invalid
        return null; // Return null if the user is not authenticated
      }
      else if  (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting admin overview:', error);
      return null;
    }
  }

  // Overzicht van gebruikersnamen en email-adressen van alle spelers
  async adminGetPlayer(): Promise<adminPlayer[] | null> {
    try {
      let response = await fetch(`${this.baseUrl}/admin/players`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAPIToken()}`, // Include the token in the request headers
        },
      });
      if (response.status === 401) {
        console.error('Unauthorized: Invalid token');
        this.promtToLogin(); // Prompt the user to log in if the token is invalid
        return null; // Return null if the user is not authenticated
      }
      else if  (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting admin overview:', error);
      return null;
    }
  }

  // Totaal van het aantal gespeelde spelletjes per dag
  async adminGetDates(): Promise<adminDateMap | null> {
    try {
      let response = await fetch(`${this.baseUrl}/admin/dates`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAPIToken()}`, // Include the token in the request headers
        },
      });
      if (response.status === 401) {
        console.error('Unauthorized: Invalid token');
        this.promtToLogin(); // Prompt the user to log in if the token is invalid
        return null; // Return null if the user is not authenticated
      }
      else if  (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting admin overview:', error);
      return null;
    }
  }
}
