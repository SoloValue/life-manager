import { Component } from "@angular/core";
import { IonApp, IonRouterOutlet } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { trash } from "ionicons/icons";
import { ConfirmPopupComponent } from "./components/confirm-popup/confirm-popup.component";
import { AlertComponent } from "./components/alert/alert.component";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  imports: [IonApp, IonRouterOutlet, ConfirmPopupComponent, AlertComponent],
})
export class AppComponent {
  constructor() {
    addIcons({ trash });
  }
}
