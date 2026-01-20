import { Injectable, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly _productsInCart = signal<Product[]>([]);

  public readonly productsInCart = this._productsInCart.asReadonly();

  public addToCart(product: Product): void {
    this._productsInCart.update(products => [...products, product]);
  }

  public removeFromCart(productId: number): void {
    this._productsInCart.update(products => products.filter(product => product.id !== productId))
  }
}
