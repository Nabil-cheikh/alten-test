import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { Product } from "app/products/data-access/product.model";

export interface WishlistItemRequest {
  productId: number;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly path = "/api/wishlist";

  private readonly _wishlistItems = signal<Product[]>([]);

  public readonly wishlistItems = this._wishlistItems.asReadonly();

  public get(): Observable<Product[]> {
    return this.http.get<Product[]>(this.path).pipe(
      tap((items) => this._wishlistItems.set(items))
    );
  }

  public addToWishlist(productId: number): Observable<Product> {
    return this.http.post<Product>(this.path, { productId }).pipe(
      tap((product) => {
        const exists = this._wishlistItems().some(p => p.id === product.id);
        if (!exists) {
          this._wishlistItems.update(items => [...items, product]);
        }
      })
    );
  }

  public removeFromWishlist(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.path}/${productId}`).pipe(
      tap(() => {
        this._wishlistItems.update(items =>
          items.filter(item => item.id !== productId)
        );
      })
    );
  }

  public isInWishlist(productId: number): boolean {
    return this._wishlistItems().some(p => p.id === productId);
  }
}
