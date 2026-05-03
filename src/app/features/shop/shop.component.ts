import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FilterPanelComponent } from '@components/filter-panel/filter-panel.component';
import { ProductCardComponent } from '@components/product-card/product-card.component';
import { SearchBarComponent } from '@components/search-bar/search-bar.component';
import { Brand, Category } from '@core/models/product.model';
import { FilterState, ProductService } from '@core/services/product.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    SearchBarComponent,
    FilterPanelComponent,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent {
  private productService = inject(ProductService);

  sidebarOpen = signal(false);

  // exposed to template
  products = this.productService.filteredProducts;
  loading = this.productService.loading;
  error = this.productService.error;
  filters = this.productService.filters;
  totalResults = this.productService.totalResults;
  hasFilters = this.productService.hasActiveFilters;

  sortOptions: { value: FilterState['sortBy']; label: string }[] = [
    { value: 'default', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low–High' },
    { value: 'price-desc', label: 'Price: High–Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'name', label: 'Name A–Z' },
  ];

  onSearch(term: string) {
    this.productService.setSearch(term);
  }
  onToggleBrand(brand: Brand) {
    this.productService.toggleBrand(brand);
  }
  onToggleCategory(cat: Category) {
    this.productService.toggleCategory(cat);
  }
  onToggleInStock() {
    this.productService.toggleInStock();
  }
  onSortChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value as FilterState['sortBy'];
    this.productService.setSortBy(val);
  }
  onClearFilters() {
    this.productService.clearFilters();
  }

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }
}
