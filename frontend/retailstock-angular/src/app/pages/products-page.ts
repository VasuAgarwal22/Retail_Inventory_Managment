import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, ProductRequest, ProductResponse, CategoryResponse } from '../core/api.service';
import { AuthService } from '../core/auth.service';

@Component({
    selector: 'app-products-page',
    standalone: true,
    imports: [FormsModule],
    template: `
    <h2 style="margin-bottom:16px;">Products</h2>
    @if (error()) { <p style="color:red;margin-bottom:12px;">{{ error() }}</p> }
    @if (success()) { <p style="color:green;margin-bottom:12px;">{{ success() }}</p> }

    <div style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:16px;margin-bottom:20px;">
      <h3 style="margin-bottom:12px;font-size:14px;">{{ editing() ? 'Edit Product' : 'Add Product' }}</h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;">
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">SKU</label>
          <input type="text" [(ngModel)]="form.sku" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:120px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Name</label>
          <input type="text" [(ngModel)]="form.name" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:160px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Description</label>
          <input type="text" [(ngModel)]="form.description" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:180px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Base Price</label>
          <input type="number" [(ngModel)]="form.basePrice" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:100px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Category</label>
          <select [(ngModel)]="form.categoryId" style="padding:6px;border:1px solid #ccc;border-radius:4px;">
            <option [value]="0">-- Select --</option>
            @for (c of categories(); track c.id) {
              <option [value]="c.id">{{ c.name }}</option>
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
            <th style="padding:10px;text-align:left;">Base Price</th>
            <th style="padding:10px;text-align:left;">Active</th>
            <th style="padding:10px;text-align:left;">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (p of products(); track p.id) {
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:10px;">{{ p.id }}</td>
              <td style="padding:10px;">{{ p.sku }}</td>
              <td style="padding:10px;">{{ p.name }}</td>
              <td style="padding:10px;">{{ p.basePrice }}</td>
              <td style="padding:10px;">{{ p.active ? '✅' : '❌' }}</td>
              <td style="padding:10px;display:flex;gap:6px;">
                <button (click)="startEdit(p)" style="padding:4px 10px;background:#f39c12;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Edit</button>
                <button (click)="deactivate(p.id)" style="padding:4px 10px;background:#e74c3c;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Deactivate</button>
              </td>
            </tr>
          }
          @empty { <tr><td colspan="6" style="padding:16px;text-align:center;color:#888;">No products found</td></tr> }
        </tbody>
      </table>
    </div>
  `,
})
export class ProductsPage implements OnInit {
    private readonly api = inject(ApiService);
    private readonly auth = inject(AuthService);
    readonly products = signal<ProductResponse[]>([]);
    readonly categories = signal<CategoryResponse[]>([]);
    readonly error = signal('');
    readonly success = signal('');
    readonly editing = signal<number | null>(null);
    form: ProductRequest = { sku: '', name: '', description: '', basePrice: 0, categoryId: 0 };

    ngOnInit() { this.load(); this.api.getAllCategories(this.auth.token()!).subscribe({ next: c => this.categories.set(c), error: () => { } }); }
    load() { this.api.getAllProducts(this.auth.token()!).subscribe({ next: p => this.products.set(p), error: e => this.error.set(e.message) }); }

    save() {
        this.error.set(''); this.success.set('');
        const token = this.auth.token()!;
        const id = this.editing();
        const obs = id ? this.api.updateProduct(token, id, this.form) : this.api.createProduct(token, this.form);
        obs.subscribe({ next: () => { this.success.set(id ? 'Updated.' : 'Created.'); this.cancelEdit(); this.load(); }, error: e => this.error.set(e.message) });
    }

    startEdit(p: ProductResponse) { this.editing.set(p.id); this.form = { sku: p.sku, name: p.name, description: p.description, basePrice: p.basePrice, categoryId: p.categoryId ?? 0 }; }
    cancelEdit() { this.editing.set(null); this.form = { sku: '', name: '', description: '', basePrice: 0, categoryId: 0 }; }

    deactivate(id: number) {
        this.error.set(''); this.success.set('');
        this.api.deactivateProduct(this.auth.token()!, id).subscribe({ next: () => { this.success.set('Deactivated.'); this.load(); }, error: e => this.error.set(e.message) });
    }
}
