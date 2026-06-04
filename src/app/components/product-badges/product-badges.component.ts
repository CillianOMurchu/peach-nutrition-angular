import { Component, computed, input } from '@angular/core';
import { Product } from '@core/models/product.model';

/**
 * Renders a product's status badges (discount / low-stock / out-of-stock).
 * The parent supplies the positioning wrapper; this only emits the spans.
 * Relies on the global `.badge` styles in styles.scss.
 */
@Component({
  selector: 'app-product-badges',
  standalone: true,
  template: `
    @if (product().discountPercentage) {
      <span class="badge badge--discount">-{{ product().discountPercentage }}%</span>
    }
    @if (isLowStock()) {
      <span class="badge badge--low-stock">Only {{ product().stockQuantity }} left</span>
    }
    @if (isOutOfStock()) {
      <span class="badge badge--out-of-stock">Out of stock</span>
    }
  `,
})
export class ProductBadgesComponent {
  product = input.required<Product>();

  isLowStock = computed(() => {
    const qty = this.product().stockQuantity;
    return qty > 0 && qty <= 5;
  });

  isOutOfStock = computed(() => this.product().stockQuantity === 0);
}
