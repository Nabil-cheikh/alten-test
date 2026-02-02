import { Component, inject, OnInit } from "@angular/core";
import { WishlistService } from "app/wishlist/data-access/wishlist.service";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { DataViewModule } from 'primeng/dataview';
import { MessageService } from "primeng/api";


@Component({
  selector: "app-wishlist-product-list",
  templateUrl: "./wishlist-product-list.component.html",
  styleUrls: ["./wishlist-product-list.component.scss"],
  standalone: true,
  imports: [DataViewModule, CardModule, ButtonModule]
})
export class WishlistProductListComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly messageService = inject(MessageService);

  public readonly wishlistProducts = this.wishlistService.wishlistItems;

  ngOnInit() {
    this.wishlistService.get().subscribe();
  }

  public onRemoveFromWishlist(productId: number) {
    this.messageService.add({
          severity: 'success',
          summary: 'Ajouté',
          detail: 'Produit retirer de vos souhaits.',
          life: 3000
    });
    this.wishlistService.removeFromWishlist(productId).subscribe();
  }
}
