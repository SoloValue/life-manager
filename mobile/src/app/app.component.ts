import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ToastContainerComponent } from "./components/toast/toast.component";
import { ConfigService } from "./services/config.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  imports: [RouterOutlet, NavbarComponent, ToastContainerComponent],
})
export class AppComponent {
  private configService = inject(ConfigService);

  constructor() {}

  ngOnInit() {
      this.configService.loadConfig().then(
        () => console.info("[app]: Configuration loaded")
    );
  }
}
