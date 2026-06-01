import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LightboxComponent } from '@components/lightbox/lightbox.component';
import { ProductImage } from '@core/models/product.model';
import { CartItem, CartService } from '@core/services/cart.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterLink, LightboxComponent],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.scss'
})
export class CartDrawerComponent {
  cart = inject(CartService);

  confirmOpen = signal(false);
  checkoutLoading = signal(false);
  checkoutError = signal('');
  lightboxImages = signal<ProductImage[]>([]);
  lightboxOpen = signal(false);

  openItemLightbox(item: CartItem) {
    this.lightboxImages.set(item.product.images);
    this.lightboxOpen.set(true);
  }

  openConfirm() {
    this.confirmOpen.set(true);
  }

  closeConfirm() {
    this.confirmOpen.set(false);
  }

  removeItem(id: string) {
    this.cart.remove(id);
    if (this.cart.isEmpty()) this.closeConfirm();
  }

  itemTotal(item: CartItem): number {
    const price = item.product.discountPercentage
      ? item.product.price * (1 - item.product.discountPercentage / 100)
      : item.product.price;
    return price * item.quantity;
  }

  navigateTo(url: string) {
    window.location.assign(url);
  }

  async checkout() {
    if (this.checkoutLoading()) return;
    this.checkoutLoading.set(true);
    this.checkoutError.set('');

    try {
      const items = this.cart.items().map((item) => ({
        name: item.product.name,
        price: item.product.discountPercentage
          ? item.product.price * (1 - item.product.discountPercentage / 100)
          : item.product.price,
        quantity: item.quantity,
      }));

      const response = await fetch(`${environment.backendUrl}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      this.navigateTo(url);
    } catch (error) {
      console.error('Checkout error:', error);
      this.checkoutError.set('Something went wrong. Please try again.');
    } finally {
      this.checkoutLoading.set(false);
    }
  }
}
