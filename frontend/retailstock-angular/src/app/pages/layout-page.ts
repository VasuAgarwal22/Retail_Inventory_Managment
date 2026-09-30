import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
    selector: 'app-layout-page',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    template: `
    <div style="display:flex;min-height:100vh;">
      <!-- Sidebar -->
      <nav style="width:200px;background:#2c3e50;color:#ecf0f1;flex-shrink:0;display:flex;flex-direction:column;">
        <div style="padding:16px;font-size:16px;font-weight:bold;border-bottom:1px solid #3d5166;">
          📦 RetailStock
        </div>
        <ul style="list-style:none;flex:1;padding:8px 0;">
          @for (link of navLinks; track link.path) {
            <li>
              <a [routerLink]="link.path" routerLinkActive="nav-active"
                 [routerLinkActiveOptions]="{exact: link.path === ''}"
                 style="display:block;padding:10px 16px;color:#ecf0f1;text-decoration:none;font-size:13px;">
                {{ link.label }}
              </a>
            </li>
          }
        </ul>
        <div style="padding:12px;border-top:1px solid #3d5166;">
          <div style="font-size:12px;color:#aaa;margin-bottom:6px;">{{ auth.email() }}</div>
          <button (click)="auth.logout()" style="width:100%;padding:7px;background:#e74c3c;color:#fff;border:none;border-radius:4px;font-size:13px;cursor:pointer;">
            Logout
          </button>
        </div>
      </nav>

      <!-- Main content -->
      <main style="flex:1;padding:24px;overflow-y:auto;">
        <router-outlet />
      </main>
    </div>

    <style>
      .nav-active { background:#1a73e8 !important; }
    </style>
  `,
})
export class LayoutPage {
    protected readonly auth = inject(AuthService);
    readonly navLinks = [
        { path: '', label: '🏠 Dashboard' },
        { path: 'users', label: '👥 Users' },
        { path: 'categories', label: '🏷️ Categories' },
        { path: 'products', label: '📦 Products' },
        { path: 'variants', label: '🎨 Variants' },
        { path: 'warehouses', label: '🏭 Warehouses' },
        { path: 'suppliers', label: '🚚 Suppliers' },
        { path: 'supplier-products', label: '🔗 Supplier Products' },
        { path: 'inventory', label: '📊 Inventory' },
        { path: 'stock-movements', label: '📈 Stock Movements' },
    ];
}
