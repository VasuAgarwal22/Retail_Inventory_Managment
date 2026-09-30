import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, User } from '../core/api.service';
import { AuthService } from '../core/auth.service';

@Component({
    selector: 'app-users-page',
    standalone: true,
    imports: [FormsModule],
    template: `
    <h2 style="margin-bottom:16px;">Users</h2>
    @if (error()) { <p style="color:red;margin-bottom:12px;">{{ error() }}</p> }
    @if (success()) { <p style="color:green;margin-bottom:12px;">{{ success() }}</p> }

    <!-- Change Password Form -->
    <details style="margin-bottom:20px;background:#fff;border:1px solid #ddd;border-radius:6px;padding:16px;">
      <summary style="cursor:pointer;font-weight:bold;">Change User Password</summary>
      <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;">
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">User ID</label>
          <input type="number" [(ngModel)]="pwForm.id" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:100px;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:3px;">New Password</label>
          <input type="password" [(ngModel)]="pwForm.newPassword" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:180px;" />
        </div>
        <button (click)="changePassword()" style="padding:7px 14px;background:#1a73e8;color:#fff;border:none;border-radius:4px;cursor:pointer;">
          Update Password
        </button>
      </div>
    </details>

    <!-- Users Table -->
    <div style="background:#fff;border:1px solid #ddd;border-radius:6px;overflow:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#f8f9fa;border-bottom:1px solid #ddd;">
            <th style="padding:10px;text-align:left;">ID</th>
            <th style="padding:10px;text-align:left;">Name</th>
            <th style="padding:10px;text-align:left;">Email</th>
            <th style="padding:10px;text-align:left;">Phone</th>
            <th style="padding:10px;text-align:left;">Action</th>
          </tr>
        </thead>
        <tbody>
          @for (u of users(); track u.id) {
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:10px;">{{ u.id }}</td>
              <td style="padding:10px;">{{ u.firstName }} {{ u.lastName }}</td>
              <td style="padding:10px;">{{ u.email }}</td>
              <td style="padding:10px;">{{ u.phoneNo }}</td>
              <td style="padding:10px;">
                <button (click)="deactivate(u.id!)" style="padding:4px 10px;background:#e74c3c;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">
                  Deactivate
                </button>
              </td>
            </tr>
          }
          @empty {
            <tr><td colspan="5" style="padding:16px;text-align:center;color:#888;">No users found</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class UsersPage implements OnInit {
    private readonly api = inject(ApiService);
    private readonly auth = inject(AuthService);
    readonly users = signal<User[]>([]);
    readonly error = signal('');
    readonly success = signal('');
    pwForm = { id: 0, newPassword: '' };

    ngOnInit() { this.load(); }

    load() {
        this.api.getAllUsers(this.auth.token()!).subscribe({
            next: u => this.users.set(u),
            error: e => this.error.set(e.message),
        });
    }

    changePassword() {
        this.error.set(''); this.success.set('');
        this.api.updatePassword(this.auth.token()!, this.pwForm.id, { newPassword: this.pwForm.newPassword }).subscribe({
            next: () => { this.success.set('Password updated.'); this.pwForm = { id: 0, newPassword: '' }; },
            error: e => this.error.set(e.message),
        });
    }

    deactivate(id: number) {
        this.error.set(''); this.success.set('');
        this.api.deactivateUser(this.auth.token()!, id).subscribe({
            next: () => { this.success.set('User deactivated.'); this.load(); },
            error: e => this.error.set(e.message),
        });
    }
}
