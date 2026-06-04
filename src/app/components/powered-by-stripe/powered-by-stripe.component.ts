import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-powered-by-stripe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './powered-by-stripe.component.html',
  styleUrl: './powered-by-stripe.component.scss'
})
export class PoweredByStripeComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color: string = 'gray400';
}