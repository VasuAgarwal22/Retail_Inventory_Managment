import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, StockMovementRequest, StockMovementResponse, ProductResponse, WarehouseResponse, MOVEMENT_TYPES } from '../core/api.service';
import { AuthService } from '../core/auth.service';

@Component({
    selector: 'app-stock-movements-page',
    standalone: true,
    imports: [FormsModule],
    template: `
    <h2 style="margin-bottom:16px;">Stock Movements</h2>
    @if (error()) { <p style="color:red;margin-bottom:12px;">{{ error() }}</p> }
    @if (success()) { <p style="color:green;margin-bottom:12px;">{{ success() }}</p> }

    <div style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:16px;margin-bottom:20px;">
      <h3 style="margin-bottom:12px;font-size:14px;">Record Stock Movement</h3>
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
          <label style="display:block;font-size:13px;margin-bottom:3px;">Movement Type</label>
          <select [(ngModel)]="form.movementType" style="padding:6px;border:1px solid #ccc;border-radius:4px;">
            @for (t of movementTypes; track t) { <option [value]="t">{{ t }}</option> }
          </select>
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Quantity</label>
          <input type="number" [(ngModel)]="form.quantity" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:80px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Ref Type</label>
          <input type="text" [(ngModel)]="form.referenceType" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:100px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Ref ID</label>
          <input type="number" [(ngModel)]="form.referenceId" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:80px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Reason</label>
          <input type="text" [(ngModel)]="form.reason" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:160px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Performed By (User ID)</label>
          <input type="number" [(ngModel)]="form.performedBy" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:100px;" />
        </div>
        <button (click)="save()" style="padding:7px 14px;background:#1a73e8;color:#fff;border:none;border-radius:4px;cursor:pointer;">
          Record
        </button>
      </div>
    </div>

    <div style="background:#fff;border:1px solid #ddd;border-radius:6px;overflow:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#f8f9fa;border-bottom:1px solid #ddd;">
            <th style="padding:10px;text-align:left;">ID</th>
            <th style="padding:10px;text-align:left;">Product ID</th>
            <th style="padding:10px;text-align:left;">Warehouse ID</th>
            <th style="padding:10px;text-align:left;">Type</th>
            <th style="padding:10px;text-align:left;">Quantity</th>
            <th style="padding:10px;text-align:left;">Reason</th>
          </tr>
        </thead>
        <tbody>
          @for (m of movements(); track m.id) {
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:10px;">{{ m.id }}</td>
              <td style="padding:10px;">{{ m.productId }}</td>
              <td style="padding:10px;">{{ m.warehouseId }}</td>
              <td style="padding:10px;">{{ m.movementType }}</td>
              <td style="padding:10px;">{{ m.quantity }}</td>
              <td style="padding:10px;">{{ m.reason }}</td>
            </tr>
          }
          @empty { <tr><td colspan="6" style="padding:16px;text-align:center;color:#888;">No movements found</td></tr> }
        </tbody>
      </table>
    </div>
  `,
})
export class StockMovementsPage implements OnInit {
    private readonly api = inject(ApiService);
    private readonly auth = inject(AuthService);
    readonly movements = signal<StockMovementResponse[]>([]);
    readonly products = signal<ProductResponse[]>([]);
    readonly warehouses = signal<WarehouseResponse[]>([]);
    readonly error = signal('');
    readonly success = signal('');
    readonly movementTypes = MOVEMENT_TYPES;
    form: StockMovementRequest = { productId: 0, warehouseId: 0, movementType: 'INBOUND', quantity: 0, referenceType: '', referenceId: 0, reason: '', performedBy: 0 };

    ngOnInit() {
        const token = this.auth.token()!;
        this.load();
        this.api.getAllProducts(token).subscribe({ next: p => this.products.set(p), error: () => { } });
        this.api.getAllWarehouses(token).subscribe({ next: w => this.warehouses.set(w), error: () => { } });
    }
    load() { this.api.getAllMovements(this.auth.token()!).subscribe({ next: m => this.movements.set(m), error: e => this.error.set(e.message) }); }

    save() {
        this.error.set(''); this.success.set('');
        this.api.createMovement(this.auth.token()!, this.form).subscribe({
            next: () => { this.success.set('Movement recorded.'); this.load(); this.resetForm(); },
            error: e => this.error.set(e.message),
        });
    }

    resetForm() { this.form = { productId: 0, warehouseId: 0, movementType: 'INBOUND', quantity: 0, referenceType: '', referenceId: 0, reason: '', performedBy: 0 }; }
}
