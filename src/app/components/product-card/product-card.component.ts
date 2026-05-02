import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  product = input.required<Product>();

  discountedPrice = computed(() => {
    const p = this.product();
    if (!p.discountPercentage) return null;
    return p.price * (1 - p.discountPercentage / 100);
  });

  stars = computed(() => {
    return Array.from({ length: 5 }, (_, i) => i < this.product().review.rating);
  });

  isLowStock = computed(() => {
    const qty = this.product().stockQuantity;
    return qty > 0 && qty <= 5;
  });

  isOutOfStock = computed(() => this.product().stockQuantity === 0);
}