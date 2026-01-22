import { Routes } from "@angular/router";
import { WishlistProductListComponent } from "./features/wishlist-product-list/wishlist-product-list.component";

export const WISHLIST_ROUTES: Routes = [
  {
    path: "list",
    component: WishlistProductListComponent
  },
  {path: "**", redirectTo: "list"},
]
