import { Component, inject, OnInit } from "@angular/core";
import { CartService } from "app/cart/data-access/cart.service";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { DataViewModule } from 'primeng/dataview';
import { Product } from "app/products/data-access/product.model";

@Component({
  selector: "app-cart-product-list",
  templateUrl: "./cart-product-list.component.html",
  styleUrls: ["./cart-product-list.component.scss"],
  standalone: true,
  imports: [DataViewModule, CardModule, ButtonModule]
})
export class CartProductListComponent {
  private readonly cartService = inject(CartService);

  public readonly cartProducts = this.cartService.productsInCart;

  public onRemoveFromCart(product: Product) {
    this.cartService.removeFromCart(product.id);
  }
}
