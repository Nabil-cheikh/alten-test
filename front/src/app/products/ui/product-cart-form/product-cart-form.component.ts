import { Component, EventEmitter, inject, input, Output, signal, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CartItem } from "app/cart/data-access/cart.model";
import { CartService } from "app/cart/data-access/cart.service";
import { Product } from "app/products/data-access/product.model";
import { ButtonModule } from "primeng/button";
import { InputNumberModule } from "primeng/inputnumber";

@Component({
  selector: 'app-product-cart-form',
  template: `
    <form #form="ngForm" (ngSubmit)="onSave()">
      <div class="form-field">
        <label for="quantity">Quantité</label>
        <p-inputNumber
          [(ngModel)]="quantity"
          [min]="1"
          name="quantity"
          required/>
      </div>
      <div class="flex justify-content-between">
        <p-button type="button" (click)="onCancel()" label="Annuler" severity="help" />
        <p-button type="submit" [disabled]="!form.valid || loading()" [loading]="loading()" label="Enregistrer" severity="success" />
      </div>
    </form>
  `,
  styleUrls: ['./product-cart-form.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputNumberModule
  ],
  encapsulation: ViewEncapsulation.None
})
export class ProductCartFormComponent {
  public readonly product = input.required<Product>();

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<CartItem>();

  private readonly cartService = inject(CartService);

  public quantity = 1;
  public loading = signal(false);

  onSave() {
    this.loading.set(true);
    this.cartService.addToCart({
      productId: this.product().id,
      quantity: this.quantity
    }).subscribe({
      next: (item) => {
        this.loading.set(false);
        this.save.emit(item);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onCancel() {
    this.cancel.emit();
  }
}
