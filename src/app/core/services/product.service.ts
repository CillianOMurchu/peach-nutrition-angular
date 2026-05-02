import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Brand, Category, Product } from '@models/product.model';

export interface FilterState {
  search: string;
  brands: Brand[];
  categories: Category[];
  inStockOnly: boolean;
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'rating' | 'name';
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  brands: [],
  categories: [],
  inStockOnly: false,
  sortBy: 'default',
};

@Injectable({ providedIn: 'root' })
export class ProductService {
  // ── private state ──────────────────────────────────────────────
  private readonly _allProducts = signal<Product[]>([]);
  private readonly _filters = signal<FilterState>({ ...DEFAULT_FILTERS });
  private readonly _loading = signal(true);
  private readonly _error = signal<string | null>(null);

  // ── public readonly signals ────────────────────────────────────
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly filters = this._filters.asReadonly();

  readonly filteredProducts = computed(() => {
    const products = this._allProducts();
    const { search, brands, categories, inStockOnly, sortBy } = this._filters();

    let result = [...products];

    // search — name, description, tags
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.tags.some((t) => t.includes(term)),
      );
    }

    // brand + category filter (OR logic across both)
    if (brands.length || categories.length) {
      result = result.filter(
        (p) =>
          (brands.length && brands.includes(p.brand)) ||
          (categories.length && categories.includes(p.category)),
      );
    }

    // stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.stockQuantity > 0);
    }

    // sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort(
          (a, b) =>
            b.review.rating - a.review.rating ||
            b.review.count - a.review.count,
        );
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  });

  readonly featuredProducts = computed(() =>
    this._allProducts().filter((p) => p.featured),
  );

  readonly totalResults = computed(() => this.filteredProducts().length);

  readonly hasActiveFilters = computed(() => {
    const { search, brands, categories, inStockOnly, sortBy } = this._filters();
    return !!(
      search ||
      brands.length ||
      categories.length ||
      inStockOnly ||
      sortBy !== 'default'
    );
  });

  // ── constructor ────────────────────────────────────────────────
  constructor(private http: HttpClient) {
    this.http
      .get<Product[]>('/data/products.json')
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (products) => {
          this._allProducts.set(products);
          this._loading.set(false);
        },
        error: (err) => {
          this._error.set('Failed to load products. Please try again.');
          this._loading.set(false);
          console.error('ProductService:', err);
        },
      });
  }

  // ── public methods ─────────────────────────────────────────────
  getById(id: string): Product | undefined {
    return this._allProducts().find((p) => p.id === id);
  }

  setSearch(search: string): void {
    this._filters.update((f) => ({ ...f, search }));
  }

  toggleBrand(brand: Brand): void {
    this._filters.update((f) => ({
      ...f,
      brands: f.brands.includes(brand)
        ? f.brands.filter((b) => b !== brand)
        : [...f.brands, brand],
    }));
  }

  toggleCategory(category: Category): void {
    this._filters.update((f) => ({
      ...f,
      categories: f.categories.includes(category)
        ? f.categories.filter((c) => c !== category)
        : [...f.categories, category],
    }));
  }

  toggleInStock(): void {
    this._filters.update((f) => ({ ...f, inStockOnly: !f.inStockOnly }));
  }

  setSortBy(sortBy: FilterState['sortBy']): void {
    this._filters.update((f) => ({ ...f, sortBy }));
  }

  clearFilters(): void {
    this._filters.set({ ...DEFAULT_FILTERS });
  }
}
