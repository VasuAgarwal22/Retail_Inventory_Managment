import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Lock, Mail, Phone, User } from 'lucide-angular';
import { AuthService } from '../../core/auth.service';
import { RoleName } from '../../core/api.service';
import { Alert } from '../ui/alert';
import { Button } from '../ui/button';
import { InputField } from '../ui/input-field';

type Field = 'firstName' | 'lastName' | 'email' | 'phoneNo' | 'password' | 'confirmPassword' | 'roleName';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, InputField, Button, Alert],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4" novalidate>
      <app-alert [message]="apiError()" />

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <app-input-field
          id="reg-first"
          name="firstName"
          label="First name"
          [icon]="UserIcon"
          placeholder="Jane"
          autocomplete="given-name"
          formControlName="firstName"
          [error]="errors().firstName"
        />
        <app-input-field
          id="reg-last"
          name="lastName"
          label="Last name"
          [icon]="UserIcon"
          placeholder="Doe"
          autocomplete="family-name"
          formControlName="lastName"
          [error]="errors().lastName"
        />
      </div>

      <app-input-field
        id="reg-email"
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
        id="reg-phone"
        name="phoneNo"
        label="Phone number"
        type="tel"
        [icon]="PhoneIcon"
        placeholder="9876543210"
        autocomplete="tel"
        formControlName="phoneNo"
        [error]="errors().phoneNo"
      />

      <div>
        <label for="reg-role" class="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
        <select id="reg-role" formControlName="roleName" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
          @for (role of roles; track role) { <option [ngValue]="role">{{ role.replaceAll('_', ' ') }}</option> }
        </select>
        <p class="mt-1 text-xs text-slate-500">Only administrators can deactivate users.</p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <app-input-field
          id="reg-password"
          name="password"
          label="Password"
          type="password"
          [icon]="LockIcon"
          placeholder="Min. 6 characters"
          autocomplete="new-password"
          formControlName="password"
          [error]="errors().password"
        />
        <app-input-field
          id="reg-confirm"
          name="confirmPassword"
          label="Confirm password"
          type="password"
          [icon]="LockIcon"
          placeholder="Repeat password"
          autocomplete="new-password"
          formControlName="confirmPassword"
          [error]="errors().confirmPassword"
        />
      </div>

      <app-button type="submit" [loading]="loading()">Create account</app-button>

      <p class="text-center text-sm text-slate-600">
        Already have an account?
        <button
          type="button"
          (click)="switchMode.emit()"
          class="font-semibold text-indigo-600 hover:underline"
        >
          Sign in
        </button>
      </p>
    </form>
  `,
})
export class RegisterForm {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly registered = output<string>();
  readonly switchMode = output<void>();

  protected readonly UserIcon = User;
  protected readonly MailIcon = Mail;
  protected readonly PhoneIcon = Phone;
  protected readonly LockIcon = Lock;

  protected readonly form = this.fb.group({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    password: '',
    confirmPassword: '',
    roleName: 'STORE_STAFF' as RoleName,
  });
  protected readonly roles: RoleName[] = ['ADMIN', 'WAREHOUSE_MANAGER', 'STORE_STAFF', 'PROCUREMENT', 'VIEWER'];
  protected readonly errors = signal<Partial<Record<Field, string>>>({});
  protected readonly apiError = signal('');
  protected readonly loading = signal(false);

  private validate() {
    const f = this.form.getRawValue();
    const errs: Partial<Record<Field, string>> = {};
    if (!f.firstName.trim()) errs.firstName = 'Required';
    if (!f.lastName.trim()) errs.lastName = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) errs.email = 'Enter a valid email address';
    if (!/^\+?\d{7,15}$/.test(f.phoneNo.replace(/[\s-]/g, ''))) errs.phoneNo = 'Enter a valid phone number';
    if (f.password.length < 6) errs.password = 'At least 6 characters';
    if (f.confirmPassword !== f.password) errs.confirmPassword = 'Passwords do not match';
    return errs;
  }

  protected async submit() {
    this.apiError.set('');
    const errs = this.validate();
    this.errors.set(errs);
    if (Object.keys(errs).length) return;

    this.loading.set(true);
    try {
      const f = this.form.getRawValue();
      await this.auth.register({
        firstName: f.firstName.trim(),
        lastName: f.lastName.trim(),
        email: f.email.trim(),
        phoneNo: f.phoneNo.trim(),
        password: f.password,
        roleName: f.roleName,
      });
      this.registered.emit(f.email.trim());
    } catch (err) {
      this.apiError.set((err as Error).message);
    } finally {
      this.loading.set(false);
    }
  }
}
