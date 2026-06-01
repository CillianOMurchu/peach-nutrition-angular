import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'app-order-cancelled',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './order-cancelled.component.html',
  styleUrl: './order-cancelled.component.scss',
})
export class OrderCancelledComponent {
  private router = inject(Router);
  private cart = inject(CartService);

  returnToCart() {
    this.cart.open();
    this.router.navigate(['/shop']);
  }
}
