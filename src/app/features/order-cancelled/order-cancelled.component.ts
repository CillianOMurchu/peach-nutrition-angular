import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-cancelled',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './order-cancelled.component.html',
  styleUrl: './order-cancelled.component.scss',
})
export class OrderCancelledComponent {}
