import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
import { GroceriesService } from "src/app/services/groceries.service";
import { GroceryItemComponent } from "../grocery-item/grocery-item.component";

@Component({
  selector: "app-grocery-list",
  imports: [GroceryItemComponent],
  templateUrl: "./grocery-list.component.html",
  styleUrl: "./grocery-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroceryListComponent {
  public groceryList = computed(() => {
    return this.groceriesService.groceryList();
  });

  constructor(private groceriesService: GroceriesService) {}

  ngOnInit() {
    this.groceriesService.refreshGroceries();
  }
}
