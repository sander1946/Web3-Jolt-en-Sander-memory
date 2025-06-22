import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './templates/app.html',
  styleUrl: './static/app.css'
})
export class App {
  protected title = 'memory-admin';
}
