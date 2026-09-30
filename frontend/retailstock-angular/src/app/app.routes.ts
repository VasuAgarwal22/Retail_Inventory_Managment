import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'auth', loadComponent: () => import('./pages/auth-page').then(m => m.AuthPage), canActivate: [guestGuard] },
  {
    path: '',
    loadComponent: () => import('./pages/layout-page').then(m => m.LayoutPage),
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./pages/dashboard-page').then(m => m.DashboardPage) },
      { path: 'users', loadComponent: () => import('./pages/users-page').then(m => m.UsersPage) },
      { path: 'categories', loadComponent: () => import('./pages/categories-page').then(m => m.CategoriesPage) },
      { path: 'products', loadComponent: () => import('./pages/products-page').then(m => m.ProductsPage) },
      { path: 'variants', loadComponent: () => import('./pages/variants-page').then(m => m.VariantsPage) },
      { path: 'warehouses', loadComponent: () => import('./pages/warehouses-page').then(m => m.WarehousesPage) },
      { path: 'suppliers', loadComponent: () => import('./pages/suppliers-page').then(m => m.SuppliersPage) },
      { path: 'supplier-products', loadComponent: () => import('./pages/supplier-products-page').then(m => m.SupplierProductsPage) },
      { path: 'inventory', loadComponent: () => import('./pages/inventory-page').then(m => m.InventoryPage) },
      { path: 'stock-movements', loadComponent: () => import('./pages/stock-movements-page').then(m => m.StockMovementsPage) },
    ],
  },
  { path: '**', redirectTo: '' },
];
