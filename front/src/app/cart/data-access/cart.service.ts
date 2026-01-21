import { Injectable, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { CartItem } from "./cart.model";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly _productsInCart = signal<CartItem[]>([]);

  public readonly productsInCart = this._productsInCart.asReadonly();

  public addToCart(product: Product): void {
    const existingItem = this._productsInCart().find(item => item.product.id === product.id);
    // if the product is in the carts, iterate its quantity
    if (existingItem) {
      this._productsInCart.update(items => items.map(pc => {
        if (pc.product.id === product.id)
          return {product: pc.product, quantity: pc.quantity + 1};
        else
          return pc;
      }))
    }
    // else, add a new element with this product and a quantity of 1
    else {
      this._productsInCart.update(items => [...items, {product: product, quantity: 1}]);
    }
  }

  public removeFromCart(productCart: CartItem): void {
    if (productCart.quantity === 1)
      this._productsInCart.update(items => items.filter(pc =>
        pc.product.id !== productCart.product.id
      ))
    else
      this._productsInCart.update(items => items.map(pc => {
        if (pc.product.id === productCart.product.id)
          return {product: pc.product, quantity: pc.quantity - 1};
        else
          return pc;
      }));
  }
}
