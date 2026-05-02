# Quick Reference

## Run & Build Commands

```bash
npm start          # ng serve — dev server on http://localhost:4200
npm run build      # ng build — production build to dist/peach-nutrition
npm run watch      # ng build --watch (dev config, useful for Vercel local dev)
npm test           # ng test — Karma (no spec files exist yet)
```

---

## Most Frequently Modified Files

| Task | File(s) to edit |
|---|---|
| Add/edit products | [public/data/products.json](public/data/products.json) |
| Change site colours/fonts/spacing | [src/styles.scss](src/styles.scss) |
| Add a new page/route | [src/app/app.routes.ts](src/app/app.routes.ts) + new feature component |
| Edit navigation links | [src/app/components/navbar/navbar.component.html](src/app/components/navbar/navbar.component.html) |
| Change cart behaviour | [src/app/core/services/cart.service.ts](src/app/core/services/cart.service.ts) |
| Change filter/search logic | [src/app/core/services/product.service.ts](src/app/core/services/product.service.ts) |
| Edit checkout button | [src/app/components/cart-drawer/cart-drawer.component.html](src/app/components/cart-drawer/cart-drawer.component.html) |
| Edit product detail page | [src/app/features/product/](src/app/features/product/) |
| Edit home page | [src/app/features/home/](src/app/features/home/) |
| Edit shop/catalogue page | [src/app/features/shop/](src/app/features/shop/) |
| Add environment variable | [src/environments/environment.ts](src/environments/environment.ts) + [environment.development.ts](src/environments/environment.development.ts) |
| Add a serverless function | [src/app/api/](src/app/api/) — new `.ts` file |

---

## Adding a New Page

1. Create `src/app/features/<name>/<name>.component.ts` (+ `.html`, `.scss`)
2. Register in `src/app/app.routes.ts`:
   ```typescript
   {
     path: 'your-path',
     loadComponent: () =>
       import('./features/<name>/<name>.component').then(m => m.YourComponent)
   }
   ```
3. Optionally add a nav link in `navbar.component.html`

---

## Adding a New Reusable Component

1. Create `src/app/components/<name>/<name>.component.ts` (+ `.html`, `.scss`)
2. Import it in the consuming component's `imports: []` array:
   ```typescript
   imports: [YourComponent]
   ```

---

## Adding a New Product

Edit [public/data/products.json](public/data/products.json). Each product follows this shape:

```json
{
  "id": "unique-kebab-id",
  "name": "Product Display Name",
  "brand": "barebells",
  "category": "protein-bar",
  "price": 3.49,
  "discountPercentage": 0,
  "stockQuantity": 20,
  "images": [
    { "src": "images/products/barebells/filename.png", "alt": "Alt text" }
  ],
  "description": "...",
  "review": { "rating": 4, "count": 128 },
  "tags": ["protein", "bar"],
  "featured": false
}
```

Valid `brand` values: `"barebells"` | `"nocco"` | `"iogenix"`
Valid `category` values: `"protein-bar"` | `"energy-drink"` | `"protein-powder"`

Product images live in `public/images/products/<brand>/`. The `src` path is relative to `public/`.

---

## Cart — Key API

```typescript
// Inject in any component
cart = inject(CartService);

// Read state
cart.items()        // CartItem[]
cart.totalItems()   // number
cart.subtotal()     // number (EUR, already discounted)
cart.isEmpty()      // boolean
cart.isOpen()       // boolean (drawer visibility)

// Mutations
cart.add(product, quantity?)
cart.remove(productId)
cart.increment(productId)
cart.decrement(productId)
cart.clear()

// Drawer
cart.open()
cart.close()
cart.toggle()
```

---

## Product Service — Key API

```typescript
private productService = inject(ProductService);

// Read state
productService.filteredProducts()  // Product[] (with active filters)
productService.featuredProducts()  // Product[] (featured: true only)
productService.loading()           // boolean
productService.error()             // string | null
productService.totalResults()      // number
productService.hasActiveFilters()  // boolean
productService.filters()           // FilterState

// Lookups
productService.getById(id)         // Product | undefined

// Mutations (filter state)
productService.setSearch(term)
productService.toggleBrand(brand)
productService.toggleCategory(cat)
productService.toggleInStock()
productService.setSortBy(value)
productService.clearFilters()
```

---

## Environment Variables

### Frontend (Angular)

Set in [src/environments/environment.ts](src/environments/environment.ts) (prod) and [src/environments/environment.development.ts](src/environments/environment.development.ts) (dev).

| Key | Purpose |
|---|---|
| `production` | `boolean` — switches Angular prod mode |
| `apiUrl` | Base path for serverless functions (`'/api'`) |

---

## TypeScript Path Aliases

Always use these in imports — never use long relative paths (`../../..`):

| Alias | Resolves to |
|---|---|
| `@components/*` | `src/app/components/*` |
| `@core/*` | `src/app/core/*` |
| `@features/*` | `src/app/features/*` |
| `@environments/*` | `src/environments/*` |
| `@models/*` | `src/app/core/models/*` |

---

## Global CSS Utility Classes

Defined in [src/styles.scss](src/styles.scss) — usable in any component template:

```html
<div class="container">              <!-- centred page wrapper, max 1280px -->
<button class="btn btn--primary">    <!-- solid peach -->
<button class="btn btn--ghost">      <!-- transparent -->
<button class="btn btn--outline">    <!-- outlined -->
<span class="badge badge--barebells"><!-- brand pill: green -->
<span class="badge badge--nocco">    <!-- brand pill: blue -->
<span class="badge badge--iogenix"> <!-- brand pill: navy -->
<div class="skeleton">              <!-- shimmer loading placeholder -->
<div class="page">                  <!-- main page wrapper with top padding for navbar -->
```

---

## Key Design Tokens (quick copy)

```scss
var(--color-peach)        // primary brand colour
var(--color-peach-light)  // light peach backgrounds
var(--color-bg)           // page background #faf8f5
var(--color-surface)      // card/drawer background #ffffff
var(--color-border)       // subtle border #eeebe6
var(--spacing-md)         // 16px
var(--spacing-lg)         // 24px
var(--spacing-xl)         // 40px
var(--radius-md)          // 12px
var(--radius-lg)          // 20px
var(--font-serif)         // DM Serif Display (headings)
var(--font-sans)          // DM Sans (body)
var(--transition)         // all 0.2s ease
var(--navbar-height)      // 64px
```
