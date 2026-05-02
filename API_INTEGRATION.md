# API Integration

## Overview

The project has one data source:

1. **Static JSON** — product catalogue served from `public/data/products.json`

---

## 1. Product Data — Static JSON

### Configuration

`HttpClient` is provided globally in [src/app/app.config.ts](src/app/app.config.ts):
```typescript
providers: [
  provideHttpClient(),
]
```

### Request

**File**: [src/app/core/services/product.service.ts](src/app/core/services/product.service.ts)

```typescript
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
    },
  });
```

- Called once in the `ProductService` constructor — no re-fetching, no caching layer
- `takeUntilDestroyed()` cleans up the subscription automatically
- Request fires when `ProductService` is first injected (which is on app boot, since `NavbarComponent` uses `CartService` and `ShopComponent` uses `ProductService`)

### Data Shape

**File**: [src/app/core/models/product.model.ts](src/app/core/models/product.model.ts)

```typescript
type Brand    = 'barebells' | 'nocco' | 'iogenix';
type Category = 'protein-bar' | 'energy-drink' | 'protein-powder';

interface Product {
  id: string;
  name: string;
  brand: Brand;
  category: Category;
  price: number;               // full price in EUR
  discountPercentage: number;  // 0 means no discount
  stockQuantity: number;
  images: { src: string; alt: string }[];
  description: string;
  review: { rating: number; count: number };
  tags: string[];
  featured: boolean;
}
```

**Source file**: [public/data/products.json](public/data/products.json)

### Loading States

`ProductService` exposes three read-only signals:
- `loading` — `Signal<boolean>` — `true` until the request settles
- `error` — `Signal<string | null>` — populated on HTTP error
- `filteredProducts` / `featuredProducts` — empty arrays until data arrives

Templates handle these states:
```html
@if (loading()) {
  <!-- skeleton cards -->
} @else if (error()) {
  <!-- error message -->
} @else {
  <!-- product grid -->
}
```

---

## Environment Configuration

**Files**:
- [src/environments/environment.ts](src/environments/environment.ts) — used in production builds
- [src/environments/environment.development.ts](src/environments/environment.development.ts) — used during `ng serve`

Angular's build system swaps the file automatically via `fileReplacements` in `angular.json`.

Current values (both environments):

```typescript
// environment.ts (production)
export const environment = {
  production: true,
  apiUrl: '/api',
};

// environment.development.ts
export const environment = {
  production: false,
  apiUrl: '/api',
};
```

---

## Adding a New API Call

1. Inject `HttpClient` into the service
2. Use the `apiUrl` from environment: `environment.apiUrl + '/endpoint'`
3. Pipe with `takeUntilDestroyed()` for automatic cleanup
4. Store results in a `signal()` and set loading/error signals accordingly

Example pattern from `ProductService`:
```typescript
constructor(private http: HttpClient) {
  this.http
    .get<MyType[]>(`${environment.apiUrl}/my-endpoint`)
    .pipe(takeUntilDestroyed())
    .subscribe({
      next: (data) => { this._data.set(data); this._loading.set(false); },
      error: ()    => { this._error.set('...'); this._loading.set(false); },
    });
}
```
