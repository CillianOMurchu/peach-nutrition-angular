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
    path: '**',
    redirectTo: ''
  }
];