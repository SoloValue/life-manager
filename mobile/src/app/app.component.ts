import { Component } from "@angular/core";
import { ConfirmPopupComponent } from "./components/confirm-popup/confirm-popup.component";
import { AlertComponent } from "./components/alert/alert.component";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  imports: [
    RouterOutlet,
    ConfirmPopupComponent,
    AlertComponent,
    NavbarComponent,
  ],
})
export class AppComponent {
  constructor() {}
}
