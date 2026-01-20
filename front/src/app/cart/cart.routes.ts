import { Routes } from "@angular/router";
import { CartProductListComponent } from "./features/product-list/cart-product-list.component";

export const CART_ROUTES: Routes = [
  {
    path: "list",
    component: CartProductListComponent
  },
  {path: "**", redirectTo: "list"},
]
