import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, WarehouseRequest, WarehouseResponse } from '../core/api.service';
import { AuthService } from '../core/auth.service';

@Component({
    selector: 'app-warehouses-page',
    standalone: true,
    imports: [FormsModule],
    template: `
    <h2 style="margin-bottom:16px;">Warehouses</h2>
    @if (error()) { <p style="color:red;margin-bottom:12px;">{{ error() }}</p> }
    @if (success()) { <p style="color:green;margin-bottom:12px;">{{ success() }}</p> }

    <div style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:16px;margin-bottom:20px;">
      <h3 style="margin-bottom:12px;font-size:14px;">{{ editing() ? 'Edit Warehouse' : 'Add Warehouse' }}</h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;">
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Code</label>
          <input type="text" [(ngModel)]="form.code" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:100px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Name</label>
          <input type="text" [(ngModel)]="form.name" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:150px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Type</label>
          <select [(ngModel)]="form.type" style="padding:6px;border:1px solid #ccc;border-radius:4px;">
            <option value="DC">DC</option>
            <option value="STORE">STORE</option>
            <option value="RETURNS">RETURNS</option>
          </select>
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Street</label>
          <input type="text" [(ngModel)]="form.address.street" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:130px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">City</label>
          <input type="text" [(ngModel)]="form.address.city" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:100px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">State</label>
          <input type="text" [(ngModel)]="form.address.state" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:80px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Postal</label>
          <input type="text" [(ngModel)]="form.address.postalCode" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:80px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Country</label>
          <input type="text" [(ngModel)]="form.address.country" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:80px;" />
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
            <th style="padding:10px;text-align:left;">Code</th>
            <th style="padding:10px;text-align:left;">Name</th>
            <th style="padding:10px;text-align:left;">Type</th>
            <th style="padding:10px;text-align:left;">City</th>
            <th style="padding:10px;text-align:left;">Active</th>
            <th style="padding:10px;text-align:left;">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (w of warehouses(); track w.id) {
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:10px;">{{ w.id }}</td>
              <td style="padding:10px;">{{ w.code }}</td>
              <td style="padding:10px;">{{ w.name }}</td>
              <td style="padding:10px;">{{ w.type }}</td>
              <td style="padding:10px;">{{ w.address?.city }}</td>
              <td style="padding:10px;">{{ w.active ? '✅' : '❌' }}</td>
              <td style="padding:10px;display:flex;gap:6px;">
                <button (click)="startEdit(w)" style="padding:4px 10px;background:#f39c12;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Edit</button>
                <button (click)="deactivate(w.id)" style="padding:4px 10px;background:#e74c3c;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Deactivate</button>
              </td>
            </tr>
          }
          @empty { <tr><td colspan="7" style="padding:16px;text-align:center;color:#888;">No warehouses found</td></tr> }
        </tbody>
      </table>
    </div>
  `,
})
export class WarehousesPage implements OnInit {
    private readonly api = inject(ApiService);
    private readonly auth = inject(AuthService);
    readonly warehouses = signal<WarehouseResponse[]>([]);
    readonly error = signal('');
    readonly success = signal('');
    readonly editing = signal<number | null>(null);
    form: WarehouseRequest = { code: '', name: '', type: 'DC', address: { street: '', city: '', state: '', postalCode: '', country: '' } };

    ngOnInit() { this.load(); }
    load() { this.api.getAllWarehouses(this.auth.token()!).subscribe({ next: w => this.warehouses.set(w), error: e => this.error.set(e.message) }); }

    save() {
        this.error.set(''); this.success.set('');
        const token = this.auth.token()!;
        const id = this.editing();
        const obs = id ? this.api.updateWarehouse(token, id, this.form) : this.api.createWarehouse(token, this.form);
        obs.subscribe({ next: () => { this.success.set(id ? 'Updated.' : 'Created.'); this.cancelEdit(); this.load(); }, error: e => this.error.set(e.message) });
    }

    startEdit(w: WarehouseResponse) {
        this.editing.set(w.id);
        this.form = { code: w.code, name: w.name, type: w.type, address: w.address ?? { street: '', city: '', state: '', postalCode: '', country: '' } };
    }
    cancelEdit() {
        this.editing.set(null);
        this.form = { code: '', name: '', type: 'DC', address: { street: '', city: '', state: '', postalCode: '', country: '' } };
    }

    deactivate(id: number) {
        this.error.set(''); this.success.set('');
        this.api.deactivateWarehouse(this.auth.token()!, id).subscribe({ next: () => { this.success.set('Deactivated.'); this.load(); }, error: e => this.error.set(e.message) });
    }
}
