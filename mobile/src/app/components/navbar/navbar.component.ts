import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
import { NavbarService } from "src/app/services/navbar.service";

@Component({
  selector: "app-navbar",
  imports: [],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  title = computed(() => this.navbarService.tile());

  constructor(private navbarService: NavbarService) {}
}
