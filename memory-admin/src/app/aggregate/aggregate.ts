import { Component, input } from '@angular/core';
import { adminAggregate } from '../api-interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aggregate',
  imports: [CommonModule],
  templateUrl: './aggregate.html',
  styleUrl: './aggregate.css'
})
export class Aggregate {
  aggregateData = input.required<adminAggregate>();
}
