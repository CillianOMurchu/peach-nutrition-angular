# Routing Map

## Route Definitions

File: [src/app/app.routes.ts](src/app/app.routes.ts)

All routes use `loadComponent()` lazy loading.

| Path | Component | File |
|---|---|---|
| `/` | `HomeComponent` | `src/app/features/home/home.component.ts` |
| `/shop` | `ShopComponent` | `src/app/features/shop/shop.component.ts` |
| `/product/:id` | `ProductComponent` | `src/app/features/product/product.component.ts` |
| `/**` | — | Redirects to `/` |

---

## Route Details

### `/` — Home

Landing page. No parameters. Displays:
- Hero section with CTA to `/shop`
- Stats bar (static numbers)
- Featured products grid (products where `featured: true`)
- Bottom CTA section

### `/shop` — Product Catalogue

No URL parameters. Filtering is entirely in-memory via `ProductService` signals — filter state does **not** persist to the URL query string.

Displays:
- Search bar
- Filter sidebar (brands, categories, in-stock toggle)
- Sort dropdown
- Product grid

### `/product/:id` — Product Detail

| Parameter | Type | Source |
|---|---|---|
| `id` | `string` | `product.id` from `products.json` |

Resolved via `ProductService.getById(id)`. If the ID does not exist and products have finished loading, the component redirects to `/shop`.

Displays:
- Image gallery with thumbnail navigation and lightbox
- Price with optional discount
- Star rating + review count
- Stock status badge (low stock / out of stock)
- Quantity selector + Add to Cart
- Related products (same brand, different id)

---

## Navigation Patterns

**Internal navigation** uses `routerLink` directives or `Router.navigate()`:

```typescript
// Template
<a routerLink="/shop">Shop</a>
<a [routerLink]="['/product', product.id]">View</a>

// Component
this.router.navigate(['/shop']);
this.router.navigate(['/product', id]);
```

**Active link styling** uses `RouterLinkActive` directive (navbar only):
```html
<a routerLinkActive="nav__link--active" routerLink="/shop">Shop</a>
```

---

## Protected Routes

None currently. All routes are publicly accessible.

---

## Adding a New Route

1. Create component in `src/app/features/<name>/`
2. Add entry to `src/app/app.routes.ts`:
   ```typescript
   {
     path: 'your-path',
     loadComponent: () =>
       import('./features/your-name/your-name.component').then(m => m.YourNameComponent)
   }
   ```
3. Add nav link in `src/app/components/navbar/navbar.component.html` if needed.
