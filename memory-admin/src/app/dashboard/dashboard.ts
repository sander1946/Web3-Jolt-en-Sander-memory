import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { adminAggregate, adminDateMap, adminPlayer } from '../api-interfaces';
import { Aggregate } from '../aggregate/aggregate';
import { Players } from '../players/players';
import { Dates } from '../dates/dates';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Aggregate, Players, Dates],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  api: ApiService;
  aggregate: adminAggregate = [
    { aantal_spellen: 0 },
    { aantal_spelers: 0 },
    []
  ];
  players: adminPlayer[] = [];
  dates: adminDateMap = {};

  constructor() {
    // Retrieve the token from localStorage
    let token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      // Optionally, redirect to login or show an error message
      window.location.href = '/login';
    }
    this.api = new ApiService();
  }

  ngOnInit() {
    // Populate the dashboard with data
    this.populateDashboard();
  }

  async populateDashboard() {
    try {
      // Call the API to get the dashboard data
      const aggregate = await this.api.adminGetGames();
      if (aggregate) {
        this.aggregate = aggregate;
      }
      const players = await this.api.adminGetPlayer();
      if (players) {
        this.players = players;
      }
      const dates = await this.api.adminGetDates();
      if (dates) {
        this.dates = dates;
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Handle error (e.g., show an error message)
    }
  }

  // populateGames(games: adminAggregate) {
  //   // Example: Populate the dashboard with game data
  //   console.log('Total Games:', games[0].aantal_spellen);
  //   console.log('Total Players:', games[1].aantal_spelers);
  //   let apiCounts = games[2];
  //   apiCounts.forEach(apiCount => {
  //     console.log(`API: ${apiCount.api}, Count: ${apiCount.aantal}`);
  //   });
  // }

  // populatePlayers(players: adminPlayer[]) {
  //   // Example: Populate the dashboard with player data
  //   players.forEach(player => {
  //     console.log(`Player: ${player.username}, Email: ${player.email}`);
  //   });
  // }

  // populateDates(games: adminDateMap) {
  //   // Example: Populate the dashboard with date data
  //   for (const [date, count] of Object.entries(games)) {
  //     console.log(`Date: ${date}, Games Played: ${count}`);
  //   }
  // }

}
