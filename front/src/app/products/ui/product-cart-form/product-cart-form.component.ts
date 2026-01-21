import { Component, computed, EventEmitter, inject, input, Output, ViewEncapsulation } from "@angular/core";
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
          [(ngModel)]="createdItem().quantity"
          [min]="1"
          name="quantity"
          required/>
      </div>
      <div class="flex justify-content-between">
        <p-button type="button" (click)="onCancel()" label="Annuler" severity="help" />
        <p-button type="submit" [disabled]="!form.valid" label="Enregistrer" severity="success" />
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
  public readonly quantity = input.required<number>();

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<CartItem>();

  private readonly cartService = inject(CartService);

  public readonly createdItem = computed(() => ({ product: this.product(), quantity: this.quantity() }));

  onSave() {
    this.cartService.addToCart(this.createdItem());
    this.save.emit(this.createdItem());
  }

  onCancel() {
    this.cancel.emit();
  }
}
