import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, InventoryRequest, InventoryResponse, ProductResponse, WarehouseResponse } from '../core/api.service';
import { AuthService } from '../core/auth.service';

@Component({
    selector: 'app-inventory-page',
    standalone: true,
    imports: [FormsModule],
    template: `
    <h2 style="margin-bottom:16px;">Inventory</h2>
    @if (error()) { <p style="color:red;margin-bottom:12px;">{{ error() }}</p> }
    @if (success()) { <p style="color:green;margin-bottom:12px;">{{ success() }}</p> }

    <div style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:16px;margin-bottom:20px;">
      <h3 style="margin-bottom:12px;font-size:14px;">{{ editing() ? 'Edit Inventory' : 'Add Inventory' }}</h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;">
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Product</label>
          <select [(ngModel)]="form.productId" style="padding:6px;border:1px solid #ccc;border-radius:4px;">
            <option [value]="0">-- Select --</option>
            @for (p of products(); track p.id) { <option [value]="p.id">{{ p.name }}</option> }
          </select>
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Warehouse</label>
          <select [(ngModel)]="form.warehouseId" style="padding:6px;border:1px solid #ccc;border-radius:4px;">
            <option [value]="0">-- Select --</option>
            @for (w of warehouses(); track w.id) { <option [value]="w.id">{{ w.name }}</option> }
          </select>
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Qty On Hand</label>
          <input type="number" [(ngModel)]="form.quantityOnHand" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:100px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Qty Reserved</label>
          <input type="number" [(ngModel)]="form.quantityReserved" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:100px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Qty Incoming</label>
          <input type="number" [(ngModel)]="form.quantityIncoming" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:100px;" />
        </div>
        <button (click)="save()" style="padding:7px 14px;background:#1a73e8;color:#fff;border:none;border-radius:4px;cursor:pointer;">
          {{ editing() ? 'Update' : 'Add' }}
        </button>
        @if (editing()) {
          <button (click)="cancelEdit()" style="padding:7px 14px;background:#888;color:#fff;border:none;border-radius:4px;cursor:pointer;">Cancel</button>
        }
      </div>
    </div>

    <div style="background:#fff;border:1px solid #ddd;border-radius:6px;overflow:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#f8f9fa;border-bottom:1px solid #ddd;">
            <th style="padding:10px;text-align:left;">ID</th>
            <th style="padding:10px;text-align:left;">Product ID</th>
            <th style="padding:10px;text-align:left;">Warehouse ID</th>
            <th style="padding:10px;text-align:left;">On Hand</th>
            <th style="padding:10px;text-align:left;">Reserved</th>
            <th style="padding:10px;text-align:left;">Incoming</th>
            <th style="padding:10px;text-align:left;">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (inv of inventory(); track inv.id) {
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:10px;">{{ inv.id }}</td>
              <td style="padding:10px;">{{ inv.productId }}</td>
              <td style="padding:10px;">{{ inv.warehouseId }}</td>
              <td style="padding:10px;">{{ inv.quantityOnHand }}</td>
              <td style="padding:10px;">{{ inv.quantityReserved }}</td>
              <td style="padding:10px;">{{ inv.quantityIncoming }}</td>
              <td style="padding:10px;display:flex;gap:6px;">
                <button (click)="startEdit(inv)" style="padding:4px 10px;background:#f39c12;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Edit</button>
                <button (click)="delete(inv.id)" style="padding:4px 10px;background:#e74c3c;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Delete</button>
              </td>
            </tr>
          }
          @empty { <tr><td colspan="7" style="padding:16px;text-align:center;color:#888;">No inventory records</td></tr> }
        </tbody>
      </table>
    </div>
  `,
})
export class InventoryPage implements OnInit {
    private readonly api = inject(ApiService);
    private readonly auth = inject(AuthService);
    readonly inventory = signal<InventoryResponse[]>([]);
    readonly products = signal<ProductResponse[]>([]);
    readonly warehouses = signal<WarehouseResponse[]>([]);
    readonly error = signal('');
    readonly success = signal('');
    readonly editing = signal<number | null>(null);
    form: InventoryRequest = { productId: 0, warehouseId: 0, quantityOnHand: 0, quantityReserved: 0, quantityIncoming: 0 };

    ngOnInit() {
        const token = this.auth.token()!;
        this.load();
        this.api.getAllProducts(token).subscribe({ next: p => this.products.set(p), error: () => { } });
        this.api.getAllWarehouses(token).subscribe({ next: w => this.warehouses.set(w), error: () => { } });
    }
    load() { this.api.getAllInventory(this.auth.token()!).subscribe({ next: i => this.inventory.set(i), error: e => this.error.set(e.message) }); }

    save() {
        this.error.set(''); this.success.set('');
        const token = this.auth.token()!;
        const id = this.editing();
        const obs = id ? this.api.updateInventory(token, id, this.form) : this.api.createInventory(token, this.form);
        obs.subscribe({ next: () => { this.success.set(id ? 'Updated.' : 'Created.'); this.cancelEdit(); this.load(); }, error: e => this.error.set(e.message) });
    }

    startEdit(inv: InventoryResponse) { this.editing.set(inv.id); this.form = { productId: inv.productId ?? 0, warehouseId: inv.warehouseId ?? 0, quantityOnHand: inv.quantityOnHand, quantityReserved: inv.quantityReserved, quantityIncoming: inv.quantityIncoming }; }
    cancelEdit() { this.editing.set(null); this.form = { productId: 0, warehouseId: 0, quantityOnHand: 0, quantityReserved: 0, quantityIncoming: 0 }; }

    delete(id: number) {
        if (!confirm('Delete this inventory record?')) return;
        this.error.set(''); this.success.set('');
        this.api.deleteInventory(this.auth.token()!, id).subscribe({ next: () => { this.success.set('Deleted.'); this.load(); }, error: e => this.error.set(e.message) });
    }
}
