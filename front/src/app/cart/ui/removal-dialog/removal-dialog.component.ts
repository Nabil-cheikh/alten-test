import { Component, input, Output, ViewEncapsulation, EventEmitter, inject, OnInit, signal } from "@angular/core";
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
        <label for="quantity">Quantité à supprimer ({{ item().quantity }} dans le panier)</label>
        <p-inputNumber
          [(ngModel)]="quantityToRemove"
          [min]="1"
          [max]="item().quantity"
          name="quantity"
          required/>
      </div>
      <div class="flex justify-content-between">
        <p-button type="button" (click)="onCancel()" label="Annuler" severity="help" />
        <p-button type="submit" [disabled]="!form.valid || loading()" [loading]="loading()" label="Enregistrer" severity="success" />
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
  private readonly cartService = inject(CartService);
  public readonly item = input.required<CartItem>();

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  public quantityToRemove = 1;
  public loading = signal(false);

  ngOnInit() {
    this.quantityToRemove = 1;
  }

  onSave() {
    this.loading.set(true);
    const currentQuantity = this.item().quantity;
    const newQuantity = currentQuantity - this.quantityToRemove;
    const productId = this.item().product.id;

    if (newQuantity <= 0) {
      this.cartService.removeFromCart(productId).subscribe({
        next: () => {
          this.loading.set(false);
          this.save.emit();
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.cartService.updateQuantity(productId, newQuantity).subscribe({
        next: () => {
          this.loading.set(false);
          this.save.emit();
        },
        error: () => this.loading.set(false)
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
