import { Component, input } from '@angular/core';
import { adminDateMap } from '../api-interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dates',
  imports: [CommonModule],
  templateUrl: './dates.html',
  styleUrl: './dates.css'
})
export class Dates {
  dateMap = input.required<adminDateMap>();
}
