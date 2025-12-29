import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
import { Router } from "@angular/router";
import { NavbarService } from "src/app/services/navbar.service";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-navbar",
  imports: [IconComponent],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  title = computed(() => this.navbarService.tile());

  constructor(
    private navbarService: NavbarService,
    private router: Router,
  ) {}

  navigateToHome() {
    this.router.navigate(["/home"]);
    this.navbarService.setTitle("HOME");
  }
}
