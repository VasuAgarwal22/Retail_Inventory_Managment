import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Lock, Mail } from 'lucide-angular';
import { AuthService } from '../../core/auth.service';
import { Alert } from '../ui/alert';
import { Button } from '../ui/button';
import { InputField } from '../ui/input-field';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, InputField, Button, Alert],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4" novalidate>
      <app-alert type="success" [message]="notice()" />
      <app-alert [message]="apiError()" />

      <app-input-field
        id="login-email"
        name="email"
        label="Email"
        type="email"
        [icon]="MailIcon"
        placeholder="you@company.com"
        autocomplete="email"
        formControlName="email"
        [error]="errors().email"
      />
      <app-input-field
        id="login-password"
        name="password"
        label="Password"
        type="password"
        [icon]="LockIcon"
        placeholder="Enter your password"
        autocomplete="current-password"
        formControlName="password"
        [error]="errors().password"
      />

      <app-button type="submit" [loading]="loading()">Sign in</app-button>

      <p class="text-center text-sm text-slate-600">
        New here?
        <button
          type="button"
          (click)="switchMode.emit()"
          class="font-semibold text-indigo-600 hover:underline"
        >
          Create an account
        </button>
      </p>
    </form>
  `,
})
export class LoginForm {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly notice = input('');
  readonly switchMode = output<void>();

  protected readonly MailIcon = Mail;
  protected readonly LockIcon = Lock;

  protected readonly form = this.fb.group({ email: '', password: '' });
  protected readonly errors = signal<{ email?: string; password?: string }>({});
  protected readonly apiError = signal('');
  protected readonly loading = signal(false);

  private validate() {
    const { email, password } = this.form.getRawValue();
    const errs: { email?: string; password?: string } = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    return errs;
  }

  protected async submit() {
    this.apiError.set('');
    const errs = this.validate();
    this.errors.set(errs);
    if (Object.keys(errs).length) return;

    this.loading.set(true);
    try {
      const { email, password } = this.form.getRawValue();
      await this.auth.login(email.trim(), password);
    } catch (err) {
      this.apiError.set((err as Error).message);
    } finally {
      this.loading.set(false);
    }
  }
}
