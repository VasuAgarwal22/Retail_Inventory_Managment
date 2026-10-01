import { Component, signal } from '@angular/core';
import { AuthBrandPanel } from '../components/auth/auth-brand-panel';
import { LoginForm } from '../components/auth/login-form';
import { RegisterForm } from '../components/auth/register-form';

@Component({
  selector: 'app-auth-page',
  imports: [AuthBrandPanel, LoginForm, RegisterForm],
  template: `
    <div class="grid min-h-screen bg-slate-50 lg:grid-cols-2">
      <app-auth-brand-panel />

      <div class="flex items-center justify-center px-4 py-10 sm:px-8">
        <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 class="text-2xl font-bold text-slate-900">
            {{ mode() === 'login' ? 'Welcome back' : 'Create your account' }}
          </h2>
          <p class="mb-6 mt-1 text-sm text-slate-500">
            {{
              mode() === 'login'
                ? 'Sign in to manage your inventory.'
                : 'Fill in your details to get started.'
            }}
          </p>

          @if (mode() === 'login') {
            <app-login-form [notice]="notice()" (switchMode)="switchMode('register')" />
          } @else {
            <app-register-form (registered)="handleRegistered()" (switchMode)="switchMode('login')" />
          }
        </div>
      </div>
    </div>
  `,
})
export class AuthPage {
  protected readonly mode = signal<'login' | 'register'>('login');
  protected readonly notice = signal('');

  protected handleRegistered() {
    this.notice.set('Account created successfully. Please sign in.');
    this.mode.set('login');
  }

  protected switchMode(next: 'login' | 'register') {
    this.notice.set('');
    this.mode.set(next);
  }
}
