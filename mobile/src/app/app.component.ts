import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ToastContainerComponent } from "./components/toast/toast.component";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  imports: [RouterOutlet, NavbarComponent, ToastContainerComponent],
})
export class AppComponent {
  constructor() {}
}
