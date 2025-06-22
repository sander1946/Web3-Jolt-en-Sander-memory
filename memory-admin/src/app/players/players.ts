import { Component, input } from '@angular/core';
import { adminPlayer } from '../api-interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-players',
  imports: [CommonModule],
  templateUrl: './players.html',
  styleUrl: './players.css'
})
export class Players {
  playerData = input.required<adminPlayer[]>();
}
