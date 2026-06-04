import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '@core/services/cart.service';
import { Product } from '@core/models/product.model';
import { discountedPrice } from '@core/utils/pricing';
import { TagListComponent } from '@components/tag-list/tag-list.component';
import { ProductBadgesComponent } from '@components/product-badges/product-badges.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule, TagListComponent, ProductBadgesComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  product = input.required<Product>();
  cart = inject(CartService);

  discountedPrice = computed(() => discountedPrice(this.product()));

  stars = computed(() => {
    return Array.from({ length: 5 }, (_, i) => i < this.product().review.rating);
  });

  isOutOfStock = computed(() => this.product().stockQuantity === 0);
}