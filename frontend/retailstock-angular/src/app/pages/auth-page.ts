import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { ApiError } from '../core/api.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f4f6f9;">
      <div style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:32px;width:360px;">
        <h1 style="font-size:20px;margin-bottom:20px;text-align:center;">Retail Inventory</h1>

        <div style="display:flex;margin-bottom:20px;border-bottom:2px solid #eee;">
          <button style="flex:1;padding:8px;background:none;border:none;font-size:14px;cursor:pointer;"
            [style.border-bottom]="mode()==='login'?'2px solid #1a73e8':'none'"
            [style.color]="mode()==='login'?'#1a73e8':'#555'"
            (click)="mode.set('login')">Login</button>
          <button style="flex:1;padding:8px;background:none;border:none;font-size:14px;cursor:pointer;"
            [style.border-bottom]="mode()==='register'?'2px solid #1a73e8':'none'"
            [style.color]="mode()==='register'?'#1a73e8':'#555'"
            (click)="mode.set('register')">Register</button>
        </div>

        @if (mode() === 'login') {
          <form (ngSubmit)="doLogin()">
            <div style="margin-bottom:12px;">
              <label style="display:block;margin-bottom:4px;">Email</label>
              <input type="email" [(ngModel)]="loginEmail" name="email" required style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;" />
            </div>
            <div style="margin-bottom:16px;">
              <label style="display:block;margin-bottom:4px;">Password</label>
              <input type="password" [(ngModel)]="loginPassword" name="password" required style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;" />
            </div>
            @if (error()) { <p style="color:red;margin-bottom:12px;font-size:13px;">{{ error() }}</p> }
            <button type="submit" [disabled]="loading()" style="width:100%;padding:10px;background:#1a73e8;color:#fff;border:none;border-radius:4px;">
              {{ loading() ? 'Logging in...' : 'Login' }}
            </button>
          </form>
        } @else {
          <form (ngSubmit)="doRegister()">
            <div style="margin-bottom:12px;">
              <label style="display:block;margin-bottom:4px;">First Name</label>
              <input type="text" [(ngModel)]="reg.firstName" name="firstName" required style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;" />
            </div>
            <div style="margin-bottom:12px;">
              <label style="display:block;margin-bottom:4px;">Last Name</label>
              <input type="text" [(ngModel)]="reg.lastName" name="lastName" required style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;" />
            </div>
            <div style="margin-bottom:12px;">
              <label style="display:block;margin-bottom:4px;">Email</label>
              <input type="email" [(ngModel)]="reg.email" name="email" required style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;" />
            </div>
            <div style="margin-bottom:12px;">
              <label style="display:block;margin-bottom:4px;">Phone</label>
              <input type="text" [(ngModel)]="reg.phoneNo" name="phoneNo" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;" />
            </div>
            <div style="margin-bottom:16px;">
              <label style="display:block;margin-bottom:4px;">Password</label>
              <input type="password" [(ngModel)]="reg.password" name="password" required style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;" />
            </div>
            @if (error()) { <p style="color:red;margin-bottom:12px;font-size:13px;">{{ error() }}</p> }
            @if (success()) { <p style="color:green;margin-bottom:12px;font-size:13px;">{{ success() }}</p> }
            <button type="submit" [disabled]="loading()" style="width:100%;padding:10px;background:#1a73e8;color:#fff;border:none;border-radius:4px;">
              {{ loading() ? 'Registering...' : 'Register' }}
            </button>
          </form>
        }
      </div>
    </div>
  `,
})
export class AuthPage {
  private readonly auth = inject(AuthService);
  readonly mode = signal<'login' | 'register'>('login');
  readonly loading = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  loginEmail = '';
  loginPassword = '';
  reg = { firstName: '', lastName: '', email: '', phoneNo: '', password: '' };

  async doLogin() {
    this.error.set(''); this.loading.set(true);
    try { await this.auth.login(this.loginEmail, this.loginPassword); }
    catch (e: unknown) { this.error.set(e instanceof Error ? e.message : 'Login failed.'); }
    finally { this.loading.set(false); }
  }

  async doRegister() {
    this.error.set(''); this.success.set(''); this.loading.set(true);
    try {
      await this.auth.register(this.reg);
      this.success.set('Registered successfully! Please login.');
      this.mode.set('login');
    } catch (e: unknown) {
      this.error.set(e instanceof Error ? e.message : 'Registration failed.');
    } finally { this.loading.set(false); }
  }
}
