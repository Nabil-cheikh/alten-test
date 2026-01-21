import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-contact-form",
  templateUrl: "./contact-form.component.html",
  styleUrls: ["./contact-form.component.scss"],
  standalone: true,
  imports: [FormsModule, ButtonModule]
})
export class ContactFormComponent {
  public isMessageSent = false;

  onSave() {
    this.isMessageSent = true;
  }
}
