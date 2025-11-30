import { Component } from "@angular/core";
import { ConfirmPopupComponent } from "./components/confirm-popup/confirm-popup.component";
import { AlertComponent } from "./components/alert/alert.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  imports: [RouterOutlet, ConfirmPopupComponent, AlertComponent],
})
export class AppComponent {
  constructor() {}
}
