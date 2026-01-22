import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { CartItem } from "./cart.model";

export interface CartItemRequest {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly path = "/api/cart";

  private readonly _productsInCart = signal<CartItem[]>([]);

  public readonly productsInCart = this._productsInCart.asReadonly();

  public get(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.path).pipe(
      tap((items) => this._productsInCart.set(items))
    );
  }

  public addToCart(request: CartItemRequest): Observable<CartItem> {
    return this.http.post<CartItem>(this.path, request).pipe(
      tap((added) => {
        const existingIndex = this._productsInCart().findIndex(
          item => item.product.id === added.product.id
        );
        if (existingIndex >= 0) {
          this._productsInCart.update(items =>
            items.map((item, i) => i === existingIndex ? added : item)
          );
        } else {
          this._productsInCart.update(items => [...items, added]);
        }
      })
    );
  }

  public updateQuantity(productId: number, quantity: number): Observable<CartItem | void> {
    return this.http.patch<CartItem>(`${this.path}/${productId}`, null, {
      params: { quantity: quantity.toString() }
    }).pipe(
      tap((updated) => {
        if (updated) {
          this._productsInCart.update(items =>
            items.map(item => item.product.id === productId ? updated : item)
          );
        } else {
          this._productsInCart.update(items =>
            items.filter(item => item.product.id !== productId)
          );
        }
      })
    );
  }

  public removeFromCart(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.path}/${productId}`).pipe(
      tap(() => {
        this._productsInCart.update(items =>
          items.filter(item => item.product.id !== productId)
        );
      })
    );
  }

  public clearLocalCart(): void {
    this._productsInCart.set([]);
  }
}
