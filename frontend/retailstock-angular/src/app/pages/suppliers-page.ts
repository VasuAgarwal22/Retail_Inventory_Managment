import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, SupplierRequest, SupplierResponse } from '../core/api.service';
import { AuthService } from '../core/auth.service';

@Component({
    selector: 'app-suppliers-page',
    standalone: true,
    imports: [FormsModule],
    template: `
    <h2 style="margin-bottom:16px;">Suppliers</h2>
    @if (error()) { <p style="color:red;margin-bottom:12px;">{{ error() }}</p> }
    @if (success()) { <p style="color:green;margin-bottom:12px;">{{ success() }}</p> }

    <div style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:16px;margin-bottom:20px;">
      <h3 style="margin-bottom:12px;font-size:14px;">{{ editing() ? 'Edit Supplier' : 'Add Supplier' }}</h3>
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
          <label style="display:block;font-size:13px;margin-bottom:3px;">Email</label>
          <input type="email" [(ngModel)]="form.email" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:160px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Phone</label>
          <input type="text" [(ngModel)]="form.phoneNo" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:120px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Payment Terms</label>
          <input type="text" [(ngModel)]="form.paymentTerms" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:120px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Lead Days</label>
          <input type="number" [(ngModel)]="form.leadTimeDays" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:80px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Rating</label>
          <input type="number" [(ngModel)]="form.rating" min="0" max="5" step="0.1" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:70px;" />
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
            <th style="padding:10px;text-align:left;">Email</th>
            <th style="padding:10px;text-align:left;">Phone</th>
            <th style="padding:10px;text-align:left;">Rating</th>
            <th style="padding:10px;text-align:left;">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (s of suppliers(); track s.id) {
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:10px;">{{ s.id }}</td>
              <td style="padding:10px;">{{ s.code }}</td>
              <td style="padding:10px;">{{ s.name }}</td>
              <td style="padding:10px;">{{ s.email }}</td>
              <td style="padding:10px;">{{ s.phoneNo }}</td>
              <td style="padding:10px;">{{ s.rating }}</td>
              <td style="padding:10px;display:flex;gap:6px;">
                <button (click)="startEdit(s)" style="padding:4px 10px;background:#f39c12;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Edit</button>
                <button (click)="delete(s.id)" style="padding:4px 10px;background:#e74c3c;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Delete</button>
              </td>
            </tr>
          }
          @empty { <tr><td colspan="7" style="padding:16px;text-align:center;color:#888;">No suppliers found</td></tr> }
        </tbody>
      </table>
    </div>
  `,
})
export class SuppliersPage implements OnInit {
    private readonly api = inject(ApiService);
    private readonly auth = inject(AuthService);
    readonly suppliers = signal<SupplierResponse[]>([]);
    readonly error = signal('');
    readonly success = signal('');
    readonly editing = signal<number | null>(null);
    form: SupplierRequest = { code: '', name: '', email: '', phoneNo: '', paymentTerms: '', leadTimeDays: 0, rating: 0 };

    ngOnInit() { this.load(); }
    load() { this.api.getAllSuppliers(this.auth.token()!).subscribe({ next: s => this.suppliers.set(s), error: e => this.error.set(e.message) }); }

    save() {
        this.error.set(''); this.success.set('');
        const token = this.auth.token()!;
        const id = this.editing();
        const obs = id ? this.api.updateSupplier(token, id, this.form) : this.api.createSupplier(token, this.form);
        obs.subscribe({ next: () => { this.success.set(id ? 'Updated.' : 'Created.'); this.cancelEdit(); this.load(); }, error: e => this.error.set(e.message) });
    }

    startEdit(s: SupplierResponse) { this.editing.set(s.id); this.form = { code: s.code, name: s.name, email: s.email, phoneNo: s.phoneNo, paymentTerms: s.paymentTerms, leadTimeDays: s.leadTimeDays, rating: s.rating }; }
    cancelEdit() { this.editing.set(null); this.form = { code: '', name: '', email: '', phoneNo: '', paymentTerms: '', leadTimeDays: 0, rating: 0 }; }

    delete(id: number) {
        if (!confirm('Delete this supplier?')) return;
        this.error.set(''); this.success.set('');
        this.api.deleteSupplier(this.auth.token()!, id).subscribe({ next: () => { this.success.set('Deleted.'); this.load(); }, error: e => this.error.set(e.message) });
    }
}
