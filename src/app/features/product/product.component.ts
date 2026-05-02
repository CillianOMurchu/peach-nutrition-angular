import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '@core/models/product.model';
import { CartService } from '@core/services/cart.service';
import { ProductService } from '@core/services/product.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected productService = inject(ProductService);
  protected cart = inject(CartService);

  lightboxOpen = signal(false);
  product = signal<Product | null>(null);
  activeIndex = signal(0);
  lightboxIndex = signal(0);
  quantity = signal(1);

  stars = computed(() => {
    const p = this.product();
    if (!p) return [];
    return Array.from({ length: 5 }, (_, i) => i < p.review.rating);
  });

  discountedPrice = computed(() => {
    const p = this.product();
    if (!p || !p.discountPercentage) return null;
    return p.price * (1 - p.discountPercentage / 100);
  });

  isOutOfStock = computed(() => (this.product()?.stockQuantity ?? 0) === 0);
  isLowStock = computed(() => {
    const qty = this.product()?.stockQuantity ?? 0;
    return qty > 0 && qty <= 5;
  });

  relatedProducts = computed(() => {
    const p = this.product();
    if (!p) return [];
    return this.productService
      .filteredProducts()
      .filter((r) => r.brand === p.brand && r.id !== p.id)
      .slice(0, 4);
  });

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeLightbox();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.router.navigate(['/shop']);
        return;
      }

      // products may not be loaded yet — watch for them
      const tryFind = () => {
        const found = this.productService.getById(id);
        if (found) {
          this.product.set(found);
          this.activeIndex.set(0);
          this.quantity.set(1);
        } else if (!this.productService.loading()) {
          this.router.navigate(['/shop']);
        }
      };

      tryFind();

      // if loading, retry once data arrives
      if (!this.product()) {
        const interval = setInterval(() => {
          tryFind();
          if (this.product() || !this.productService.loading()) {
            clearInterval(interval);
          }
        }, 50);
      }
    });
  }

  setActive(index: number) {
    this.activeIndex.set(index);
  }

  incrementQty() {
    const max = this.product()?.stockQuantity ?? 1;
    this.quantity.update((q) => Math.min(q + 1, max));
  }

  decrementQty() {
    this.quantity.update((q) => Math.max(q - 1, 1));
  }

  openLightbox() {
    this.lightboxIndex.set(this.activeIndex());
    this.lightboxOpen.set(true);
  }

  closeLightbox() {
    this.lightboxOpen.set(false);
  }

  setLightboxIndex(index: number) {
    this.lightboxIndex.set(index);
  }
}
