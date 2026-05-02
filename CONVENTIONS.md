# Conventions

## File Naming

| Type | Convention | Example |
|---|---|---|
| Components | `kebab-case.component.ts/html/scss` | `product-card.component.ts` |
| Services | `kebab-case.service.ts` | `cart.service.ts` |
| Models | `kebab-case.model.ts` | `product.model.ts` |
| Environments | `environment[.development].ts` | `environment.development.ts` |
| Features (pages) | `src/app/features/<name>/` | `src/app/features/shop/` |
| Shared UI | `src/app/components/<name>/` | `src/app/components/filter-panel/` |

---

## TypeScript Conventions

### Classes and Interfaces

```typescript
// Interfaces: PascalCase
interface CartItem { ... }
interface FilterState { ... }

// Types: PascalCase
type Brand = 'barebells' | 'nocco' | 'iogenix';
type Category = 'protein-bar' | 'energy-drink' | 'protein-powder';
```

### Signals naming pattern

Private writable signals use an underscore prefix; public exposure uses a readonly accessor:

```typescript
// Private
private _items = signal<CartItem[]>([]);
private _loading = signal(true);

// Public readonly
readonly items   = this._items.asReadonly();
readonly loading = this._loading.asReadonly();
```

Computed signals are exposed directly without underscore prefix:
```typescript
readonly subtotal    = computed(() => ...);
readonly totalItems  = computed(() => ...);
readonly isEmpty     = computed(() => ...);
```

### Component signals

Local component state uses plain `signal()` without underscore:
```typescript
menuOpen   = signal(false);
sidebarOpen = signal(true);
quantity   = signal(1);
```

### Injection

Use `inject()` function, not constructor injection, in components:
```typescript
// Components
cart = inject(CartService);
private router = inject(Router);

// Services (constructor injection is acceptable in services)
constructor(private http: HttpClient) { ... }
```

---

## Component Conventions

### Always standalone

Every component has `standalone: true`. No NgModules.

```typescript
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
```

### Inputs and Outputs

Use the signal-based `input()` / `output()` API, not `@Input()` / `@Output()` decorators:

```typescript
// Input (required)
product = input.required<Product>();

// Input (optional with default)
value = input<string>('');

// Output
searched  = output<string>();
cleared   = output<void>();
```

### Template control flow

Use Angular 17+ block syntax — **not** `*ngIf` / `*ngFor`:

```html
@if (cart.isEmpty()) { ... }
@if (!cart.isEmpty()) { ... }

@for (item of cart.items(); track item.product.id) { ... }
@for (n of [1,2,3,4]; track n) { ... }  <!-- skeleton loading -->

@else { ... }   <!-- within @if blocks -->
```

---

## Styling Conventions

### SCSS structure

Each component has its own `.scss` file scoped to that component. Global tokens are defined in [src/styles.scss](src/styles.scss) as CSS custom properties.

### BEM naming

Component styles use BEM (`block__element--modifier`):

```scss
.cart-item { }
.cart-item__image-wrap { }
.cart-item__price--original { }

.drawer { }
.drawer--open { }
.drawer__header { }
.drawer__footer { }
```

### CSS custom properties

All design tokens are in `src/styles.scss` under `:root`. Always use these rather than hardcoding values:

```scss
// Colors
var(--color-peach)           // #f4845f
var(--color-peach-light)     // #fdf0eb
var(--color-bg)              // #faf8f5
var(--color-surface)         // #ffffff
var(--color-border)          // #eeebe6
var(--color-text-primary)    // #1a1a1a
var(--color-text-muted)      // #7a7570
var(--color-text-light)      // #b0aba5
var(--color-discount)        // #e03e3e

// Brand-specific colors
var(--color-barebells)       // #2d7a3a
var(--color-nocco)           // #0099cc
var(--color-iogenix)         // #1a2b6b

// Spacing
var(--spacing-xs)  // 4px
var(--spacing-sm)  // 8px
var(--spacing-md)  // 16px
var(--spacing-lg)  // 24px
var(--spacing-xl)  // 40px
var(--spacing-2xl) // 64px

// Radius
var(--radius-sm)   // 6px
var(--radius-md)   // 12px
var(--radius-lg)   // 20px
var(--radius-full) // 999px

// Other
var(--shadow-card)
var(--shadow-hover)
var(--transition)          // all 0.2s ease
var(--navbar-height)       // 64px
var(--max-width)           // 1280px
var(--font-sans)           // DM Sans
var(--font-serif)          // DM Serif Display
```

### Global utility classes

Defined in `src/styles.scss` — use these in templates rather than re-declaring:

```html
<div class="container">          <!-- centered, max-width wrapper -->
<button class="btn btn--primary"> <!-- filled peach button -->
<button class="btn btn--ghost">   <!-- transparent button -->
<button class="btn btn--outline"> <!-- outlined button -->
<span class="badge badge--barebells"> <!-- brand badge -->
<span class="badge badge--nocco">
<span class="badge badge--iogenix">
<div class="skeleton">            <!-- shimmer loading placeholder -->
```

---

## Import Conventions

### Path aliases (always use these, not relative paths)

```typescript
import { CartService }     from '@core/services/cart.service';
import { Product }         from '@core/models/product.model';
import { ProductService }  from '@core/services/product.service';
import { ProductCardComponent } from '@components/product-card/product-card.component';
import { environment }     from '@environments/environment';
```

Aliases are defined in [tsconfig.json](tsconfig.json):

```json
"paths": {
  "@components/*": ["src/app/components/*"],
  "@core/*":       ["src/app/core/*"],
  "@features/*":   ["src/app/features/*"],
  "@environments/*": ["src/environments/*"],
  "@models/*":     ["src/app/core/models/*"]
}
```

### Import order (convention, not enforced by linter)

1. Angular core (`@angular/core`, `@angular/common`, `@angular/router`)
2. Third-party libraries
3. Internal aliases (`@core/...`, `@components/...`, `@environments/...`)

---

## Template Conventions

### Event binding

```html
(click)="cart.close()"
(click)="cart.decrement(item.product.id)"
(input)="onInput($event)"
```

### Property binding

```html
[class.drawer--open]="cart.isOpen()"
[disabled]="item.quantity >= item.product.stockQuantity"
[src]="item.product.images[0].src"
```

### Calling signals in templates

Signals are always called as functions: `cart.isOpen()`, `cart.items()`, `product()`. Not `cart.isOpen` or `cart.items`.

### `track` in `@for`

Always track by a stable unique identifier:
```html
@for (item of cart.items(); track item.product.id) { ... }
@for (product of products(); track product.id) { ... }
```

---

## No Testing

No unit or integration tests exist in this project. Karma/Jasmine is installed as a dev dependency (from Angular CLI scaffolding) but no spec files have been written.
