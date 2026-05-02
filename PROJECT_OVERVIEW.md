# Peach Nutrition — Project Overview

## Purpose

Peach Nutrition is a sports nutrition e-commerce storefront. It sells protein bars, energy drinks, and protein powder from three premium brands (Barebells, NOCCO, iOGenix). The site allows customers to browse, filter, and add items to a cart.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 19.2 (standalone components) |
| Language | TypeScript 5.7 (strict mode) |
| Styling | SCSS + CSS custom properties |
| State | Angular Signals |
| HTTP | Angular `HttpClient` + RxJS |
| Carousel | Swiper 12 |
| Hosting | Vercel (static + serverless functions) |
| Fonts | Google Fonts — DM Sans (body), DM Serif Display (headings) |

---

## Architecture

**Pattern**: Standalone Angular SPA — no NgModules, all components are `standalone: true`.

```
bootstrapApplication(AppComponent, appConfig)
  └── AppComponent
        ├── NavbarComponent       (always rendered)
        ├── CartDrawerComponent   (always rendered, fixed-position overlay)
        └── <router-outlet>       (lazy-loaded pages)
              ├── HomeComponent         /
              ├── ShopComponent         /shop
              └── ProductComponent      /product/:id
```

All page-level components are lazy-loaded via `loadComponent()`. The navbar and cart drawer are eagerly loaded in the root shell because they are always visible.

---

## Key Directories

```
src/
├── app/
│   ├── api/                      Vercel serverless functions (payment-intent.ts)
│   ├── components/               Reusable UI components
│   │   ├── cart-drawer/          Slide-out shopping cart overlay
│   │   ├── filter-panel/         Brand/category/stock filter chips
│   │   ├── navbar/               Fixed top navigation bar
│   │   ├── product-card/         Product tile used in grids
│   │   └── search-bar/           Text search input
│   ├── core/
│   │   ├── models/               TypeScript interfaces (product.model.ts)
│   │   └── services/             Business logic services
│   │       ├── cart.service.ts   Cart state + localStorage persistence
│   │       └── product.service.ts Product loading + filtering logic
│   ├── features/                 Page-level (route) components
│   │   ├── home/                 Landing page with hero + featured products
│   │   ├── product/              Product detail page with gallery
│   │   └── shop/                 Product catalogue with filters
│   ├── app.component.ts          Root shell component
│   ├── app.config.ts             Angular providers (router, http)
│   └── app.routes.ts             Route definitions
├── environments/
│   ├── environment.ts            Production config
│   └── environment.development.ts Development config
└── styles.scss                   Global CSS variables, reset, utility classes
public/
├── data/
│   └── products.json             Static product catalogue (source of truth)
└── images/
    ├── logos/                    Brand logos (PNG/SVG)
    └── products/                 Product images organised by brand
```

---

## Build Tools

- **Angular CLI 19.2** — `ng serve`, `ng build`
- **SCSS** compilation handled by the Angular build pipeline
- **TypeScript path aliases** configured in `tsconfig.json`:
  - `@components/*` → `src/app/components/*`
  - `@core/*` → `src/app/core/*`
  - `@features/*` → `src/app/features/*`
  - `@environments/*` → `src/environments/*`
  - `@models/*` → `src/app/core/models/*`
- **Vercel** deployment: static Angular build + Node.js serverless functions in `src/app/api/`

---

## Data Flow (High Level)

```
products.json  →  ProductService (signals)  →  ShopComponent / HomeComponent
                                            →  ProductComponent
                                            →  FilterPanel / SearchBar

CartService (signals + localStorage)  →  NavbarComponent (badge count)
                                      →  CartDrawerComponent (item list)
                                      →  ProductComponent (add to cart)
```
