import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { TabViewModule } from "primeng/tabview";
import { MessageModule } from "primeng/message";
import { AuthService, LoginRequest, RegisterRequest } from "app/shared/data-access/auth.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  standalone: true,
  imports: [
    CardModule,
    RouterLink,
    ButtonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    TabViewModule,
    MessageModule
  ],
})
export class HomeComponent {
  private readonly authService = inject(AuthService);

  public readonly appTitle = "ALTEN SHOP";
  public readonly isLoggedIn = this.authService.isLoggedIn;

  // Login form
  public loginEmail = "";
  public loginPassword = "";

  // Register form
  public registerUsername = "";
  public registerFirstname = "";
  public registerEmail = "";
  public registerPassword = "";

  // UI state
  public loading = signal(false);
  public errorMessage = signal<string | null>(null);
  public successMessage = signal<string | null>(null);

  onLogin() {
    this.loading.set(true);
    this.errorMessage.set(null);

    const request: LoginRequest = {
      email: this.loginEmail,
      password: this.loginPassword
    };

    this.authService.login(request).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set("Connexion réussie !");
        this.loginEmail = "";
        this.loginPassword = "";
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.error || "Erreur de connexion");
      }
    });
  }

  onRegister() {
    this.loading.set(true);
    this.errorMessage.set(null);

    const request: RegisterRequest = {
      username: this.registerUsername,
      firstname: this.registerFirstname,
      email: this.registerEmail,
      password: this.registerPassword
    };

    this.authService.register(request).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        this.registerUsername = "";
        this.registerFirstname = "";
        this.registerEmail = "";
        this.registerPassword = "";
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.error || "Erreur lors de l'inscription");
      }
    });
  }

  onLogout() {
    this.authService.logout();
    this.successMessage.set(null);
  }
}
