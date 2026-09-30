import { Injectable, computed, inject, signal } from '@angular/core';
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
  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  readonly email = computed(() => {
    const token = this._token();
    return token ? (decodeToken(token)?.sub ?? null) : null;
  });

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
    this.router.navigateByUrl('/auth');
  }
}
