import { Component, inject, OnInit, signal } from "@angular/core";
import { CartService } from "app/cart/data-access/cart.service";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { DataViewModule } from 'primeng/dataview';
import { CartItem } from "app/cart/data-access/cart.model";
import { DialogModule } from "primeng/dialog";
import { RemovalDialogComponent } from "app/cart/ui/removal-dialog/removal-dialog.component";

@Component({
  selector: "app-cart-product-list",
  templateUrl: "./cart-product-list.component.html",
  styleUrls: ["./cart-product-list.component.scss"],
  standalone: true,
  imports: [DataViewModule, CardModule, ButtonModule, DialogModule, RemovalDialogComponent]
})
export class CartProductListComponent {
  private readonly cartService = inject(CartService);

  public readonly cartProducts = this.cartService.productsInCart;

  public isRemovalDialogVisible = false;
  public itemToRemove: CartItem | null = null;

  public onRemoveFromCart(item: CartItem) {
    // this.cartService.removeFromCart(item);
    this.itemToRemove = item;
    this.isRemovalDialogVisible = true;
  }

  public onSave(item: CartItem) {
    this.isRemovalDialogVisible = false;
    this.itemToRemove = null;
  }

  public onCancel() {
    this.isRemovalDialogVisible = false;
    this.itemToRemove = null;
  }
}
