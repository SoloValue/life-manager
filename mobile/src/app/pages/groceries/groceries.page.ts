import { ChangeDetectionStrategy, Component } from "@angular/core";
import { GroceryListComponent } from "src/app/components/grocery-list/grocery-list.component";
import { GroceriesService } from "src/app/services/groceries.service";
import { NavbarService } from "src/app/services/navbar.service";

@Component({
  selector: "app-groceries",
  imports: [GroceryListComponent],
  templateUrl: "./groceries.page.html",
  styleUrl: "./groceries.page.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroceriesPage {
  constructor(private navbarService: NavbarService) {}

  ngOnInit() {
    this.navbarService.setTitle("Groceries");
  }
}
