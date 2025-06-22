import { Component, input } from '@angular/core';
import { adminPlayer } from '../api-interfaces';

@Component({
  selector: 'app-players',
  imports: [],
  templateUrl: './players.html',
  styleUrl: './players.css'
})
export class Players {
  playerData = input.required<adminPlayer[]>();
}
