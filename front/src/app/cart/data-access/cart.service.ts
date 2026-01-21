import { Injectable, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { CartItem } from "./cart.model";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly _productsInCart = signal<CartItem[]>([]);

  public readonly productsInCart = this._productsInCart.asReadonly();

  public addToCart(item: CartItem): void {
    const existingItem = this._productsInCart().find(i => i.product.id === item.product.id);
    // if the product is in the carts, iterate its quantity
    if (existingItem) {
      this._productsInCart.update(items => items.map(pc => {
        if (pc.product.id === item.product.id)
          return {product: pc.product, quantity: pc.quantity + item.quantity};
        else
          return pc;
      }))
    }
    // else, add a new element with this product and a quantity of 1
    else {
      this._productsInCart.update(items =>
        [...items, {product: item.product, quantity: item.quantity}]
      );
    }
  }

  public removeFromCart(itemToRemove: CartItem): void {
    this._productsInCart.update(items =>
      items.
        map(pc => {
          if (pc.product.id !== itemToRemove.product.id) {
            return pc;
          }
          const newQuantity = pc.quantity - itemToRemove.quantity;
          return { ...pc, quantity: newQuantity };
        })
        .filter(pc => pc.quantity > 0)
    )
  }
}
