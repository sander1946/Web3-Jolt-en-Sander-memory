import type { adminAggregate, adminDateMap, adminPlayer, playerData, playerGames, playerPreferences, playerScores, PlayerToken } from "./interfaces";
import { showPopup } from './main.js';

export class API {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:8000'; // Adjust the base URL as needed
  }

  promtToLogin() {
    // Redirect to the login page if the user is not authenticated
    showPopup(`
      <h2>Login Required</h2>
      <p>Your session has expired, Please log in again.</p>
      <p><a href="/login">Click here to login</a></p>
    `);
  }

  public getAPIToken(): string | null {
    // Retrieve the API token from local storage or any other secure storage
    return localStorage.getItem('token');
  }

  // Overzicht van de spelers en hun gemiddelde score (ongesorteerd)
  async publicGetScores(): Promise<playerScores | null> {
    try {
      const response = await fetch(`${this.baseUrl}/memory/scores`);
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
      const response = await fetch(`${this.baseUrl}/memory/top-scores`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json() as playerScores;
    } catch (error) {
      console.error('Error fetching top scores:', error);
      return null
    }
  }

  // Registeren van een speler
  async publicRegisterPlayer(username: string, email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/memory/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"username":username, "email":email, "password":password}),
      });
      if (response.status === 400) {
        throw new Error('Bad Request: Gegevens niet kloppen met het model');
      }
      else if (!(response.status === 201 || response.status === 200)) {
        throw new Error('Network response was not ok');
      }
      return false; // Registration successful
    } catch (error) {
      console.error('Error registering player:', error);
      return true; // Return true to indicate an error occurred
    }
  }

  // Als de credentials kloppen met de speler, komt hier een JWT terug
  async publicLoginPlayer(username: string, password: string): Promise<string | boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/memory/login`, {
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
      const data = await response.json();
      return data.token; // Assuming the token is returned in the response
    } catch (error) {
      console.error('Error logging in player:', error);
      return true; // Return true to indicate an error occurred
    }
  }

  async publicSaveGame(data: any): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/game/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.status === 400) {
        throw new Error('Bad Request: Gegevens kloppen niet met het model');
      }
      else if (!(response.status === 201 || response.status === 200)) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error saving game:', error);
    }
  }

  // player
  // De `id` van de speler zit in de het JWT (de `sub`-claim). Dat `id` wordt server side uit het JWT gehaald.

  // Alle gegevens van speler `id`
  async playerGetPlayerData(): Promise<playerData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/player`, {
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
      else if (response.status === 404) {
        throw new Error('Not Found: The player with this ID does not seem to exist');
      }
      else if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json() as playerData;
    } catch (error) {
      console.error('Error getting play information:', error);
      return null;
    }
  }

  // De spellen die de speler met `id` heeft gespeeld
  async playerGetGames(): Promise<playerGames | null> {
    try {
      const response = await fetch(`${this.baseUrl}/player/games`, {
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
      else if (response.status === 404) {
        throw new Error('Not Found: The player with this ID does not seem to exist');
      }
      else if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json() as playerGames;
    } catch (error) {
      console.error('Error getting play information:', error);
      return null;
    }
  }

  // De voorkeuren van speler `id` (api en kleuren voor gesloten en gevonden kaarten)
  async playerGetPreferences(): Promise<playerPreferences | null> {
    try {
      const response = await fetch(`${this.baseUrl}/player/preferences`, {
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
      else if (response.status === 404) {
        throw new Error('Not Found: The player with this ID does not seem to exist');
      }
      else if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json() as playerPreferences;
    } catch (error) {
      console.error('Error getting player preferences:', error);
      return null;
    }
  }

  // Aanpassen van de voorkeuren van speler `id` (api en kleuren voor gesloten en gevonden kaarten)
  async playerUpdatePreferences(data: any): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/player/preferences`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAPIToken()}`, // Include the token in the request headers
        },
        body: JSON.stringify(data),
      });
      if (response.status === 400) {
        throw new Error('Bad Request: Gegevens kloppen niet met het model');
      }
      else if (response.status === 401) {
        console.error('Unauthorized: Invalid token');
        this.promtToLogin(); // Prompt the user to log in if the token is invalid
      }
      else if (response.status === 404) {
        throw new Error('Not Found: The player with this ID does not seem to exist');
      }
      else if (!(response.status === 204 || response.status === 200)) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error getting player preferences:', error);
    }
  }

  // Het email-adres van speler `id`
  async playerGetEmail(): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/player/email`, {
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
      else if (response.status === 404) {
        throw new Error('Not Found: The player with this ID does not seem to exist');
      }
      else if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.text() as string; // The email is returned as plain text
    } catch (error) {
      console.error('Error getting player preferences:', error);
      return null;
    }
  }

  // Aanpassen van het email=adres van speler `id`
  async playerUpdateEmail(email: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/player/email`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.getAPIToken()}`, // Include the token in the request headers
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (response.status === 400) {
        throw new Error('Bad Request: Gegevens kloppen niet met het model');
      }
      else if (response.status === 401) {
        console.error('Unauthorized: Invalid token');
        this.promtToLogin(); // Prompt the user to log in if the token is invalid
      }
      else if (response.status === 404) {
        throw new Error('Not Found: The player with this ID does not seem to exist');
      }
      else if (!(response.status === 204 || response.status === 200)) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error updating player email:', error);
    }
  }

  // admin
  // totaal aantal gespeelde spellen en spelers; overzicht van de gekozen api's
  async adminGetGames(): Promise<adminAggregate | null> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/aggregate`, {
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
      const response = await fetch(`${this.baseUrl}/admin/players`, {
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
      const response = await fetch(`${this.baseUrl}/admin/dates`, {
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

