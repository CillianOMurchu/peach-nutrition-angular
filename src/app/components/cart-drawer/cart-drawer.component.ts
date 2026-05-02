import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem, CartService } from '@core/services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.scss'
})
export class CartDrawerComponent {
  cart = inject(CartService);

  confirmOpen = signal(false);
  sent = signal(false);

  openConfirm() {
    this.confirmOpen.set(true);
    this.sent.set(false);
  }

  closeConfirm() {
    this.confirmOpen.set(false);
  }

  itemTotal(item: CartItem): number {
    const price = item.product.discountPercentage
      ? item.product.price * (1 - item.product.discountPercentage / 100)
      : item.product.price;
    return price * item.quantity;
  }

  confirmOrder() {
    this.cart.clear();
    this.sent.set(true);
  }

  finishOrder() {
    this.sent.set(false);
    this.confirmOpen.set(false);
    this.cart.close();
  }
}
