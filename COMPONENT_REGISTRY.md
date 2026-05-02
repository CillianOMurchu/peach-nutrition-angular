# Component Registry

## Overview

All components are `standalone: true` Angular 19 components. No NgModules exist. Components fall into two categories:

- **Feature components** — page-level, registered as routes, lazy-loaded
- **UI components** — reusable, imported directly by features or other components

---

## Feature Components (Pages)

### `HomeComponent`
- **File**: [src/app/features/home/home.component.ts](src/app/features/home/home.component.ts)
- **Route**: `/`
- **Purpose**: Landing page — hero, stats, featured products grid, bottom CTA
- **Dependencies**: `ProductService`, `ProductCardComponent`, `RouterLink`, `CommonModule`
- **Inputs**: None
- **Key signals/computed**:
  - `featured` — products where `featured: true` from `ProductService`
  - `brands` / `stats` — static arrays for the UI
- **Notable behaviour**: Uses `IntersectionObserver` + `@ViewChildren('animateIn')` to trigger CSS scroll-in animations

---

### `ShopComponent`
- **File**: [src/app/features/shop/shop.component.ts](src/app/features/shop/shop.component.ts)
- **Route**: `/shop`
- **Purpose**: Product catalogue with search, filtering, and sorting
- **Dependencies**: `ProductService`, `ProductCardComponent`, `SearchBarComponent`, `FilterPanelComponent`, `CommonModule`
- **Inputs**: None
- **Key signals**:
  - `products` — `filteredProducts` computed signal from `ProductService`
  - `loading`, `error`, `filters`, `totalResults`, `hasFilters` — from `ProductService`
  - `sidebarOpen` — local signal controlling sidebar visibility
- **Event handlers**: `onSearch`, `onToggleBrand`, `onToggleCategory`, `onToggleInStock`, `onSortChange`, `onClearFilters`, `toggleSidebar`

---

### `ProductComponent`
- **File**: [src/app/features/product/product.component.ts](src/app/features/product/product.component.ts)
- **Route**: `/product/:id`
- **Purpose**: Product detail — gallery, pricing, reviews, quantity selector, add to cart, related products
- **Dependencies**: `CartService`, `ProductService`, `ActivatedRoute`, `Router`, `CommonModule`, `RouterLink`
- **Inputs**: None (reads `:id` from route params)
- **Key signals/computed**:
  - `product` — resolved `Product | null`
  - `activeIndex` — selected thumbnail index
  - `lightboxOpen`, `lightboxIndex` — lightbox state
  - `quantity` — selected add-to-cart quantity
  - `stars` — `boolean[]` array for star display
  - `discountedPrice` — `number | null`
  - `isOutOfStock`, `isLowStock` — stock status
  - `relatedProducts` — same-brand products excluding current
- **Notable behaviour**: Polls with `setInterval` (50ms) if products are still loading when the route activates. Listens to `document:keydown.escape` to close lightbox.

---

## UI Components (Reusable)

### `NavbarComponent`
- **File**: [src/app/components/navbar/navbar.component.ts](src/app/components/navbar/navbar.component.ts)
- **Selector**: `<app-navbar>`
- **Purpose**: Fixed top navigation bar — logo, nav links, cart icon with item count badge, mobile hamburger menu
- **Dependencies**: `CartService`, `RouterLink`, `RouterLinkActive`, `CommonModule`
- **Inputs**: None
- **Key signals**:
  - `cart.totalItems()` — displayed as badge count
  - `menuOpen` — mobile menu toggle state
  - `scrolled` — adds `navbar--scrolled` class after 20px scroll
- **Notable behaviour**: `@HostListener('window:scroll')` adds shadow/background when page is scrolled

---

### `CartDrawerComponent`
- **File**: [src/app/components/cart-drawer/cart-drawer.component.ts](src/app/components/cart-drawer/cart-drawer.component.ts)
- **Selector**: `<app-cart-drawer>`
- **Purpose**: Slide-out overlay cart — item list with quantity controls, subtotal, checkout button
- **Dependencies**: `CartService`, `RouterLink`, `CommonModule`
- **Inputs**: None (reads everything from `CartService`)
- **Key template bindings**:
  - `cart.isOpen()` — controls `drawer--open` class and backdrop visibility
  - `cart.isEmpty()` — switches between empty state and item list
  - `cart.items()` — `@for` loop rendering each `CartItem`
  - `cart.subtotal()` — displayed in footer and checkout button
- **Actions wired**: `cart.close()`, `cart.decrement()`, `cart.increment()`, `cart.remove()`
- **Not yet wired**: Checkout button has no `(click)` handler

---

### `ProductCardComponent`
- **File**: [src/app/components/product-card/product-card.component.ts](src/app/components/product-card/product-card.component.ts)
- **Selector**: `<app-product-card>`
- **Purpose**: Product tile displayed in grids (home featured section, shop catalogue)
- **Dependencies**: `RouterLink`, `CommonModule`
- **Inputs**:
  - `product` (required) — `Product` object via `input.required<Product>()`
- **Computed**:
  - `discountedPrice` — `number | null`
  - `stars` — `boolean[]` for star display
  - `isLowStock`, `isOutOfStock` — stock status booleans
- **Navigation**: clicking the card or "View Product" button navigates to `/product/:id`

---

### `FilterPanelComponent`
- **File**: [src/app/components/filter-panel/filter-panel.component.ts](src/app/components/filter-panel/filter-panel.component.ts)
- **Selector**: `<app-filter-panel>`
- **Purpose**: Brand chips, category chips, in-stock toggle, and clear-all button
- **Dependencies**: `CommonModule`
- **Inputs**:
  - `filters` (required) — `FilterState` from `ProductService`
- **Outputs**:
  - `brandToggled` — emits `Brand` when a brand chip is clicked
  - `categoryToggled` — emits `Category` when a category chip is clicked
  - `inStockToggled` — emits `void` when the toggle is clicked
  - `cleared` — emits `void` when "Clear all" is clicked
- **No internal state** — purely driven by `filters` input, delegates all changes upward

---

### `SearchBarComponent`
- **File**: [src/app/components/search-bar/search-bar.component.ts](src/app/components/search-bar/search-bar.component.ts)
- **Selector**: `<app-search-bar>`
- **Purpose**: Text input with search icon and clear button
- **Dependencies**: `CommonModule`
- **Inputs**:
  - `value` — `string`, current search term (default `''`)
- **Outputs**:
  - `searched` — emits `string` on every keystroke (`input` event) or `''` on clear
- **No debouncing** — filtering happens immediately in `ProductService.filteredProducts` computed signal

---

## Component Hierarchy

```
AppComponent
├── NavbarComponent
│   └── (uses CartService for badge count)
├── CartDrawerComponent
│   └── (uses CartService for items + actions)
└── <router-outlet>
    ├── HomeComponent
    │   └── ProductCardComponent (×N featured)
    ├── ShopComponent
    │   ├── SearchBarComponent
    │   ├── FilterPanelComponent
    │   └── ProductCardComponent (×N filtered)
    └── ProductComponent
        └── (no sub-components, self-contained)
```

---

## Adding a New Component

**Reusable UI component:**
```
src/app/components/<name>/
  <name>.component.ts
  <name>.component.html
  <name>.component.scss
```

**Page component:**
```
src/app/features/<name>/
  <name>.component.ts
  <name>.component.html
  <name>.component.scss
```

Then register in `app.routes.ts` if it's a page.
