import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, ProductVariantRequest, ProductVariantResponse, ProductResponse } from '../core/api.service';
import { AuthService } from '../core/auth.service';

@Component({
    selector: 'app-variants-page',
    standalone: true,
    imports: [FormsModule],
    template: `
    <h2 style="margin-bottom:16px;">Product Variants</h2>
    @if (error()) { <p style="color:red;margin-bottom:12px;">{{ error() }}</p> }
    @if (success()) { <p style="color:green;margin-bottom:12px;">{{ success() }}</p> }

    <div style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:16px;margin-bottom:20px;">
      <h3 style="margin-bottom:12px;font-size:14px;">{{ editing() ? 'Edit Variant' : 'Add Variant' }}</h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;">
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">SKU</label>
          <input type="text" [(ngModel)]="form.sku" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:120px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Name</label>
          <input type="text" [(ngModel)]="form.name" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:150px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Description</label>
          <input type="text" [(ngModel)]="form.description" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:180px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Price</label>
          <input type="number" [(ngModel)]="form.price" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:100px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Product</label>
          <select [(ngModel)]="form.productId" style="padding:6px;border:1px solid #ccc;border-radius:4px;">
            <option [value]="0">-- Select Product --</option>
            @for (p of products(); track p.id) {
              <option [value]="p.id">{{ p.name }}</option>
            }
          </select>
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
            <th style="padding:10px;text-align:left;">SKU</th>
            <th style="padding:10px;text-align:left;">Name</th>
            <th style="padding:10px;text-align:left;">Price</th>
            <th style="padding:10px;text-align:left;">Active</th>
            <th style="padding:10px;text-align:left;">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (v of variants(); track v.id) {
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:10px;">{{ v.id }}</td>
              <td style="padding:10px;">{{ v.sku }}</td>
              <td style="padding:10px;">{{ v.name }}</td>
              <td style="padding:10px;">{{ v.price }}</td>
              <td style="padding:10px;">{{ v.active ? '✅' : '❌' }}</td>
              <td style="padding:10px;display:flex;gap:6px;">
                <button (click)="startEdit(v)" style="padding:4px 10px;background:#f39c12;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Edit</button>
                <button (click)="deactivate(v.id)" style="padding:4px 10px;background:#e74c3c;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Deactivate</button>
              </td>
            </tr>
          }
          @empty { <tr><td colspan="6" style="padding:16px;text-align:center;color:#888;">No variants found</td></tr> }
        </tbody>
      </table>
    </div>
  `,
})
export class VariantsPage implements OnInit {
    private readonly api = inject(ApiService);
    private readonly auth = inject(AuthService);
    readonly variants = signal<ProductVariantResponse[]>([]);
    readonly products = signal<ProductResponse[]>([]);
    readonly error = signal('');
    readonly success = signal('');
    readonly editing = signal<number | null>(null);
    form: ProductVariantRequest = { sku: '', name: '', description: '', price: 0, productId: 0 };

    ngOnInit() {
        this.load();
        this.api.getAllProducts(this.auth.token()!).subscribe({ next: p => this.products.set(p), error: () => { } });
    }
    load() { this.api.getAllVariants(this.auth.token()!).subscribe({ next: v => this.variants.set(v), error: e => this.error.set(e.message) }); }

    save() {
        this.error.set(''); this.success.set('');
        const token = this.auth.token()!;
        const id = this.editing();
        const obs = id ? this.api.updateVariant(token, id, this.form) : this.api.createVariant(token, this.form);
        obs.subscribe({ next: () => { this.success.set(id ? 'Updated.' : 'Created.'); this.cancelEdit(); this.load(); }, error: e => this.error.set(e.message) });
    }

    startEdit(v: ProductVariantResponse) { this.editing.set(v.id); this.form = { sku: v.sku, name: v.name, description: v.description, price: v.price, productId: 0 }; }
    cancelEdit() { this.editing.set(null); this.form = { sku: '', name: '', description: '', price: 0, productId: 0 }; }

    deactivate(id: number) {
        this.error.set(''); this.success.set('');
        this.api.deactivateVariant(this.auth.token()!, id).subscribe({ next: () => { this.success.set('Deactivated.'); this.load(); }, error: e => this.error.set(e.message) });
    }
}
