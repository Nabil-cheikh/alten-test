import { Component, OnInit, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { CartItem } from "app/cart/data-access/cart.model";
import { CartService } from "app/cart/data-access/cart.service";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { AuthService } from "app/shared/data-access/auth.service";
import { WishlistService } from "app/wishlist/data-access/wishlist.service";
import { ProductCartFormComponent } from "app/products/ui/product-cart-form/product-cart-form.component";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [DataViewModule, CardModule, ButtonModule, DialogModule, ProductFormComponent, ProductCartFormComponent],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly wishlistService = inject(WishlistService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  public readonly products = this.productsService.products;
  public readonly isAdmin = this.authService.isAdmin;

  public isDialogVisible = false;
  public isCartDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  ngOnInit() {
    this.productsService.get().subscribe();
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe();
  }

  public onAddToCart(product: Product) {
    if (!this.authService.isLoggedIn()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Connexion requise',
        detail: 'Veuillez vous connecter pour ajouter des produits au panier.',
        life: 5000
      });
      this.router.navigate(['/home']);
      return;
    }
    this.isCartDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onAddToWishlist(product: Product) {
    if (!this.authService.isLoggedIn()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Connexion requise',
        detail: 'Veuillez vous connecter pour ajouter des produits à votre liste de souhaits.',
        life: 5000
      });
      this.router.navigate(['/home']);
      return;
    }
    this.wishlistService.addToWishlist(product.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Ajouté',
          detail: 'Produit ajouté à votre liste de souhaits.',
          life: 3000
        });
      }
    });
  }

  public onSaveCart(item: CartItem) {
    this.closeCartDialog();
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
    this.closeCartDialog();
  }

  private closeCartDialog() {
    this.isCartDialogVisible = false;
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }
}
