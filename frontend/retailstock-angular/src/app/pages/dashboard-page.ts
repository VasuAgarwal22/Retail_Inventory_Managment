import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';

@Component({
    selector: 'app-dashboard-page',
    standalone: true,
    template: `
    <h2 style="margin-bottom:20px;">Dashboard</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;">
      @for (card of cards(); track card.label) {
        <div style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:20px;text-align:center;">
          <div style="font-size:28px;">{{ card.icon }}</div>
          <div style="font-size:24px;font-weight:bold;margin:8px 0;">{{ card.count }}</div>
          <div style="color:#666;font-size:13px;">{{ card.label }}</div>
        </div>
      }
    </div>
    @if (error()) { <p style="color:red;margin-top:16px;">{{ error() }}</p> }
  `,
})
export class DashboardPage implements OnInit {
    private readonly api = inject(ApiService);
    private readonly auth = inject(AuthService);
    readonly cards = signal<{ icon: string; label: string; count: number | string }[]>([]);
    readonly error = signal('');

    ngOnInit() {
        const token = this.auth.token()!;
        this.cards.set([
            { icon: '👥', label: 'Users', count: '...' },
            { icon: '🏷️', label: 'Categories', count: '...' },
            { icon: '📦', label: 'Products', count: '...' },
            { icon: '🏭', label: 'Warehouses', count: '...' },
            { icon: '🚚', label: 'Suppliers', count: '...' },
            { icon: '📊', label: 'Inventory', count: '...' },
            { icon: '📈', label: 'Stock Movements', count: '...' },
        ]);

        this.api.getAllUsers(token).subscribe({ next: u => this.updateCard('Users', u.length), error: () => { } });
        this.api.getAllCategories(token).subscribe({ next: c => this.updateCard('Categories', c.length), error: () => { } });
        this.api.getAllProducts(token).subscribe({ next: p => this.updateCard('Products', p.length), error: () => { } });
        this.api.getAllWarehouses(token).subscribe({ next: w => this.updateCard('Warehouses', w.length), error: () => { } });
        this.api.getAllSuppliers(token).subscribe({ next: s => this.updateCard('Suppliers', s.length), error: () => { } });
        this.api.getAllInventory(token).subscribe({ next: i => this.updateCard('Inventory', i.length), error: () => { } });
        this.api.getAllMovements(token).subscribe({ next: m => this.updateCard('Stock Movements', m.length), error: () => { } });
    }

    private updateCard(label: string, count: number) {
        this.cards.update(cards => cards.map(c => c.label === label ? { ...c, count } : c));
    }
}
