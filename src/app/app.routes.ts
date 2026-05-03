import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./features/shop/shop.component').then(m => m.ShopComponent)
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product/product.component').then(m => m.ProductComponent)
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./features/legal/privacy/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: 'returns',
    loadComponent: () =>
      import('./features/legal/returns/returns.component').then(m => m.ReturnsComponent)
  },
  {
    path: 'shipping',
    loadComponent: () =>
      import('./features/legal/shipping/shipping.component').then(m => m.ShippingComponent)
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./features/legal/terms/terms.component').then(m => m.TermsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];