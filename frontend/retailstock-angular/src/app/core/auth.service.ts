import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiError, ApiService, RegisterPayload, User } from './api.service';
import { decodeToken, isTokenValid } from './jwt';

const TOKEN_KEY = 'token';

function readStoredToken(): string | null {
  const stored = localStorage.getItem(TOKEN_KEY);
  return isTokenValid(stored) ? stored : null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(readStoredToken());
  private readonly _user = signal<User | null>(null);

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  // Backend JWT only carries the email (subject), so it's the identity we trust here.
  readonly email = computed(() => {
    const token = this._token();
    return token ? (decodeToken(token)?.sub ?? null) : null;
  });

  constructor() {
    // Load full profile (name, roles) whenever we have a token.
    effect((onCleanup) => {
      const token = this._token();
      if (!token) return;

      const email = this.email();
      const sub = this.api.getAllUsers(token).subscribe({
        next: (users) => this._user.set(users.find((u) => u.email === email) ?? null),
        error: (err: ApiError) => {
          if (err.status === 401 || err.status === 403) this.logout();
        },
      });
      onCleanup(() => sub.unsubscribe());
    });

    // Auto-logout when the 2h token expires.
    effect((onCleanup) => {
      const token = this._token();
      if (!token) return;

      const exp = decodeToken(token)?.exp ?? 0;
      const msLeft = exp * 1000 - Date.now();
      const timer = setTimeout(() => this.logout(), Math.max(msLeft, 0));
      onCleanup(() => clearTimeout(timer));
    });
  }

  async login(email: string, password: string): Promise<void> {
    const { token } = await firstValueFrom(this.api.login(email, password));
    localStorage.setItem(TOKEN_KEY, token);
    this._token.set(token);
    await this.router.navigateByUrl('/');
  }

  register(payload: RegisterPayload) {
    return firstValueFrom(this.api.register(payload));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
    this._user.set(null);
    this.router.navigateByUrl('/auth');
  }
}
