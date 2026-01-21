import { Component, input, Output, ViewEncapsulation, EventEmitter, computed, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CartItem } from "app/cart/data-access/cart.model";
import { CartService } from "app/cart/data-access/cart.service";
import { ButtonModule } from "primeng/button";
import { InputNumberModule } from "primeng/inputnumber";


@Component({
  selector: "app-removal-dialog",
  template: `
  <form #form="ngForm" (ngSubmit)="onSave()">
      <div class="form-field">
        <label for="quantity">Quantité à supprimer</label>
        <p-inputNumber
          [(ngModel)]="quantityToRemove"
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
  styleUrls: ["./removal-dialog.component.scss"],
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputNumberModule
  ],
  encapsulation: ViewEncapsulation.None,
})
export class RemovalDialogComponent implements OnInit {
  public readonly cartService = inject(CartService);
  public readonly item = input.required<CartItem>();

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<CartItem>();

  public quantityToRemove = 1;

  ngOnInit() {
    this.quantityToRemove = 1;
  }

  onSave() {
    const itemToRemove: CartItem = {
      product: this.item().product,
      quantity: this.quantityToRemove
    };
    this.cartService.removeFromCart(itemToRemove);
    this.save.emit(itemToRemove);
  }

  onCancel() {
    this.cancel.emit();
  }

}
