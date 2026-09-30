import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, SupplierProductRequest, SupplierProductResponse, SupplierResponse, ProductResponse } from '../core/api.service';
import { AuthService } from '../core/auth.service';

@Component({
    selector: 'app-supplier-products-page',
    standalone: true,
    imports: [FormsModule],
    template: `
    <h2 style="margin-bottom:16px;">Supplier Products</h2>
    @if (error()) { <p style="color:red;margin-bottom:12px;">{{ error() }}</p> }
    @if (success()) { <p style="color:green;margin-bottom:12px;">{{ success() }}</p> }

    <div style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:16px;margin-bottom:20px;">
      <h3 style="margin-bottom:12px;font-size:14px;">{{ editing() ? 'Edit Supplier Product' : 'Add Supplier Product' }}</h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;">
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Supplier</label>
          <select [(ngModel)]="form.supplierId" style="padding:6px;border:1px solid #ccc;border-radius:4px;">
            <option [value]="0">-- Select --</option>
            @for (s of suppliers(); track s.id) { <option [value]="s.id">{{ s.name }}</option> }
          </select>
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Product</label>
          <select [(ngModel)]="form.productId" style="padding:6px;border:1px solid #ccc;border-radius:4px;">
            <option [value]="0">-- Select --</option>
            @for (p of products(); track p.id) { <option [value]="p.id">{{ p.name }}</option> }
          </select>
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Unit Cost</label>
          <input type="number" [(ngModel)]="form.unitCost" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:110px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">MOQ</label>
          <input type="number" [(ngModel)]="form.moq" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:80px;" />
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
            <th style="padding:10px;text-align:left;">Supplier ID</th>
            <th style="padding:10px;text-align:left;">Product ID</th>
            <th style="padding:10px;text-align:left;">Unit Cost</th>
            <th style="padding:10px;text-align:left;">MOQ</th>
            <th style="padding:10px;text-align:left;">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (sp of supplierProducts(); track sp.id) {
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:10px;">{{ sp.id }}</td>
              <td style="padding:10px;">{{ sp.supplierId }}</td>
              <td style="padding:10px;">{{ sp.productId }}</td>
              <td style="padding:10px;">{{ sp.unitCost }}</td>
              <td style="padding:10px;">{{ sp.moq }}</td>
              <td style="padding:10px;display:flex;gap:6px;">
                <button (click)="startEdit(sp)" style="padding:4px 10px;background:#f39c12;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Edit</button>
                <button (click)="delete(sp.id)" style="padding:4px 10px;background:#e74c3c;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Delete</button>
              </td>
            </tr>
          }
          @empty { <tr><td colspan="6" style="padding:16px;text-align:center;color:#888;">No records found</td></tr> }
        </tbody>
      </table>
    </div>
  `,
})
export class SupplierProductsPage implements OnInit {
    private readonly api = inject(ApiService);
    private readonly auth = inject(AuthService);
    readonly supplierProducts = signal<SupplierProductResponse[]>([]);
    readonly suppliers = signal<SupplierResponse[]>([]);
    readonly products = signal<ProductResponse[]>([]);
    readonly error = signal('');
    readonly success = signal('');
    readonly editing = signal<number | null>(null);
    form: SupplierProductRequest = { supplierId: 0, productId: 0, unitCost: 0, moq: 0 };

    ngOnInit() {
        const token = this.auth.token()!;
        this.load();
        this.api.getAllSuppliers(token).subscribe({ next: s => this.suppliers.set(s), error: () => { } });
        this.api.getAllProducts(token).subscribe({ next: p => this.products.set(p), error: () => { } });
    }
    load() { this.api.getAllSupplierProducts(this.auth.token()!).subscribe({ next: sp => this.supplierProducts.set(sp), error: e => this.error.set(e.message) }); }

    save() {
        this.error.set(''); this.success.set('');
        const token = this.auth.token()!;
        const id = this.editing();
        const obs = id ? this.api.updateSupplierProduct(token, id, this.form) : this.api.createSupplierProduct(token, this.form);
        obs.subscribe({ next: () => { this.success.set(id ? 'Updated.' : 'Created.'); this.cancelEdit(); this.load(); }, error: e => this.error.set(e.message) });
    }

    startEdit(sp: SupplierProductResponse) { this.editing.set(sp.id); this.form = { supplierId: sp.supplierId ?? 0, productId: sp.productId ?? 0, unitCost: sp.unitCost, moq: sp.moq }; }
    cancelEdit() { this.editing.set(null); this.form = { supplierId: 0, productId: 0, unitCost: 0, moq: 0 }; }

    delete(id: number) {
        if (!confirm('Delete this record?')) return;
        this.error.set(''); this.success.set('');
        this.api.deleteSupplierProduct(this.auth.token()!, id).subscribe({ next: () => { this.success.set('Deleted.'); this.load(); }, error: e => this.error.set(e.message) });
    }
}
