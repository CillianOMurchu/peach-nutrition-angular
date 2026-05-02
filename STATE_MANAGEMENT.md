# State Management

## Approach

This project uses **Angular Signals** (introduced in Angular 16, fully stable in Angular 17+) as its exclusive state mechanism. There is no Redux, NgRx, BehaviorSubject, or Context API. All state lives in injectable services.

---

## Services as State Containers

### `CartService`
**File**: [src/app/core/services/cart.service.ts](src/app/core/services/cart.service.ts)
**Provided in**: `root` (singleton)

#### State

| Signal | Type | Description |
|---|---|---|
| `_items` (private) | `Signal<CartItem[]>` | Array of `{ product: Product, quantity: number }` |
| `_open` (private) | `Signal<boolean>` | Whether the cart drawer is visible |

#### Derived (computed)

| Computed | Type | Formula |
|---|---|---|
| `totalItems` | `number` | Sum of all `item.quantity` |
| `subtotal` | `number` | Sum of `(discountedPrice \| price) × quantity` per item |
| `isEmpty` | `boolean` | `items.length === 0` |

#### Public readonly signals

```typescript
readonly items    = this._items.asReadonly();
readonly isOpen   = this._open.asReadonly();
readonly totalItems = computed(...)
readonly subtotal   = computed(...)
readonly isEmpty    = computed(...)
```

Templates consume these directly: `cart.items()`, `cart.subtotal()`, etc.

#### Side Effects

An `effect()` in the constructor automatically serialises `_items` to `localStorage` on every change:
```typescript
effect(() => {
  localStorage.setItem('peach_nutrition_cart', JSON.stringify(this._items()));
});
```

Cart state is **hydrated from localStorage** on service instantiation via `loadFromStorage()`.

#### Methods (mutations)

| Method | Description |
|---|---|
| `add(product, quantity?)` | Adds item; respects `stockQuantity` cap; opens drawer |
| `remove(productId)` | Removes item entirely |
| `increment(productId)` | +1 quantity (capped at `stockQuantity`) |
| `decrement(productId)` | -1 quantity; removes item if quantity reaches 0 |
| `clear()` | Empties cart |
| `open()` / `close()` / `toggle()` | Controls drawer visibility |

---

### `ProductService`
**File**: [src/app/core/services/product.service.ts](src/app/core/services/product.service.ts)
**Provided in**: `root` (singleton)

#### State

| Signal | Type | Description |
|---|---|---|
| `_allProducts` (private) | `Signal<Product[]>` | Full product catalogue, loaded once via HTTP |
| `_filters` (private) | `Signal<FilterState>` | Active filter + sort state |
| `_loading` (private) | `Signal<boolean>` | True until HTTP request completes |
| `_error` (private) | `Signal<string \| null>` | Error message if HTTP fails |

#### `FilterState` shape

```typescript
interface FilterState {
  search: string;
  brands: Brand[];       // multi-select, OR logic
  categories: Category[];// multi-select, OR logic
  inStockOnly: boolean;
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'rating' | 'name';
}
```

#### Derived (computed)

| Computed | Description |
|---|---|
| `filteredProducts` | `_allProducts` after applying all active filters + sort |
| `featuredProducts` | Products where `featured === true` (no filter applied) |
| `totalResults` | `filteredProducts().length` |
| `hasActiveFilters` | `true` if any filter differs from default |

#### Filter logic

`filteredProducts` is a single computed signal that chains:
1. Search (name, description, brand, tags — case-insensitive substring)
2. Brand + category filter (OR across both arrays)
3. In-stock filter (`stockQuantity > 0`)
4. Sort switch

Because it is a computed signal, Angular automatically re-evaluates it whenever `_allProducts` or `_filters` changes. No manual subscription needed.

#### Mutation methods

| Method | Effect |
|---|---|
| `setSearch(term)` | Updates `filters.search` |
| `toggleBrand(brand)` | Adds/removes brand from `filters.brands` |
| `toggleCategory(cat)` | Adds/removes category from `filters.categories` |
| `toggleInStock()` | Flips `filters.inStockOnly` |
| `setSortBy(value)` | Updates `filters.sortBy` |
| `clearFilters()` | Resets to `DEFAULT_FILTERS` |
| `getById(id)` | Point lookup in `_allProducts` (not a signal) |

---

## Data Flow Diagram

```
HTTP GET /data/products.json
        │
        ▼
ProductService._allProducts (signal)
        │
        ├── filteredProducts (computed) ──► ShopComponent.products
        │                                   ShopComponent renders ProductCardComponent[]
        │
        ├── featuredProducts (computed) ──► HomeComponent.featured
        │
        └── getById(id) ──────────────────► ProductComponent.product (signal)


User interactions:
  SearchBar (output: searched)
  FilterPanel (outputs: brandToggled, categoryToggled, etc.)
        │
        ▼ (ShopComponent calls ProductService methods)
  ProductService._filters (signal) ──► filteredProducts re-computes


  ProductComponent "Add to Cart" button
        │
        ▼
  CartService.add(product, quantity)
        │
        ├── _items updated ──► localStorage.setItem (via effect)
        ├── totalItems/subtotal re-computed
        ├── NavbarComponent cart badge updates
        ├── CartDrawerComponent item list updates
        └── _open.set(true) ──► drawer slides open
```

---

## Local Component State

Some state is local to individual components (not in services) because it's purely UI-level:

| Component | Local Signal | Purpose |
|---|---|---|
| `ShopComponent` | `sidebarOpen` | Filter sidebar collapse on mobile |
| `NavbarComponent` | `menuOpen`, `scrolled` | Mobile menu, scroll effect |
| `ProductComponent` | `product`, `activeIndex`, `lightboxOpen`, `lightboxIndex`, `quantity` | Gallery and lightbox UI state |

---

## Persistence

| Data | Storage | Key |
|---|---|---|
| Cart items | `localStorage` | `peach_nutrition_cart` |
| Filter state | In-memory only | — resets on page refresh |
| All other state | In-memory only | — |
