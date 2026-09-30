import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo?: string;
  roles?: string[];
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

/** Error carrying the HTTP status, mirroring the React client's thrown Error. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  token?: string | null;
}

/** Parses a body defensively: register returns plain text, login returns JSON. */
function parseBody(text: string | null): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  request<T = unknown>(path: string, { method = 'GET', body, token }: RequestOptions = {}): Observable<T> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http
      .request(method, `${environment.apiUrl}${path}`, {
        body,
        headers,
        responseType: 'text',
      })
      .pipe(
        map((text) => parseBody(text) as T),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 0) {
            return throwError(
              () => new ApiError('Cannot reach the server. Is the backend running on port 8080?', 0),
            );
          }
          const data = parseBody(typeof err.error === 'string' ? err.error : null);
          const serverMessage =
            data && typeof data === 'object' ? (data as { message?: string }).message : undefined;
          const message =
            serverMessage ||
            (err.status === 401 || err.status === 403
              ? 'Invalid email or password.'
              : 'Something went wrong. Please try again.');
          return throwError(() => new ApiError(message, err.status));
        }),
      );
  }

  login(email: string, password: string) {
    return this.request<LoginResponse>('/api/auth/login', { method: 'POST', body: { email, password } });
  }

  register(payload: RegisterPayload) {
    return this.request('/api/auth/register', { method: 'POST', body: payload });
  }

  getAllUsers(token: string) {
    return this.request<User[]>('/api/auth/all', { token });
  }
}
