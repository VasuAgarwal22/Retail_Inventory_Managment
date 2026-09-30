import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, CategoryRequest, CategoryResponse } from '../core/api.service';
import { AuthService } from '../core/auth.service';

@Component({
    selector: 'app-categories-page',
    standalone: true,
    imports: [FormsModule],
    template: `
    <h2 style="margin-bottom:16px;">Categories</h2>
    @if (error()) { <p style="color:red;margin-bottom:12px;">{{ error() }}</p> }
    @if (success()) { <p style="color:green;margin-bottom:12px;">{{ success() }}</p> }

    <!-- Create / Edit Form -->
    <div style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:16px;margin-bottom:20px;">
      <h3 style="margin-bottom:12px;font-size:14px;">{{ editing() ? 'Edit Category' : 'Add Category' }}</h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;">
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Name</label>
          <input type="text" [(ngModel)]="form.name" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:180px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">Description</label>
          <input type="text" [(ngModel)]="form.description" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:220px;" />
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
            <th style="padding:10px;text-align:left;">Name</th>
            <th style="padding:10px;text-align:left;">Description</th>
            <th style="padding:10px;text-align:left;">Active</th>
            <th style="padding:10px;text-align:left;">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (c of categories(); track c.id) {
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:10px;">{{ c.id }}</td>
              <td style="padding:10px;">{{ c.name }}</td>
              <td style="padding:10px;">{{ c.description }}</td>
              <td style="padding:10px;">{{ c.active ? '✅' : '❌' }}</td>
              <td style="padding:10px;display:flex;gap:6px;">
                <button (click)="startEdit(c)" style="padding:4px 10px;background:#f39c12;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Edit</button>
                <button (click)="deactivate(c.id)" style="padding:4px 10px;background:#e74c3c;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Deactivate</button>
              </td>
            </tr>
          }
          @empty { <tr><td colspan="5" style="padding:16px;text-align:center;color:#888;">No categories found</td></tr> }
        </tbody>
      </table>
    </div>
  `,
})
export class CategoriesPage implements OnInit {
    private readonly api = inject(ApiService);
    private readonly auth = inject(AuthService);
    readonly categories = signal<CategoryResponse[]>([]);
    readonly error = signal('');
    readonly success = signal('');
    readonly editing = signal<number | null>(null);
    form: CategoryRequest = { name: '', description: '' };

    ngOnInit() { this.load(); }
    load() { this.api.getAllCategories(this.auth.token()!).subscribe({ next: c => this.categories.set(c), error: e => this.error.set(e.message) }); }

    save() {
        this.error.set(''); this.success.set('');
        const token = this.auth.token()!;
        const id = this.editing();
        const obs = id ? this.api.updateCategory(token, id, this.form) : this.api.createCategory(token, this.form);
        obs.subscribe({ next: () => { this.success.set(id ? 'Updated.' : 'Created.'); this.cancelEdit(); this.load(); }, error: e => this.error.set(e.message) });
    }

    startEdit(c: CategoryResponse) { this.editing.set(c.id); this.form = { name: c.name, description: c.description }; }
    cancelEdit() { this.editing.set(null); this.form = { name: '', description: '' }; }

    deactivate(id: number) {
        this.error.set(''); this.success.set('');
        this.api.deactivateCategory(this.auth.token()!, id).subscribe({ next: () => { this.success.set('Deactivated.'); this.load(); }, error: e => this.error.set(e.message) });
    }
}
