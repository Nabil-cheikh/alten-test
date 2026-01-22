import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Observable, tap } from "rxjs";

export interface RegisterRequest {
  username: string;
  firstname: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  token: string;
}

export interface User {
  id: number;
  username: string;
  firstname: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _token = signal<string | null>(localStorage.getItem('token'));

  public readonly token = this._token.asReadonly();
  public readonly isLoggedIn = () => !!this._token();
  public readonly isAdmin = () => this.getEmailFromToken() === 'admin@admin.com';

  register(request: RegisterRequest): Observable<User> {
    return this.http.post<User>('/account', request);
  }

  login(request: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>('/token', request).pipe(
      tap(response => {
        this._token.set(response.token);
        localStorage.setItem('token', response.token);
      })
    );
  }

  logout(): void {
    this._token.set(null);
    localStorage.removeItem('token');
  }

  private getEmailFromToken(): string | null {
    const token = this._token();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.sub || decoded.email || null;
    } catch {
      return null;
    }
  }
}
