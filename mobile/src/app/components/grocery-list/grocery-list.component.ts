import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from "@angular/core";
import { GroceriesService } from "src/app/services/groceries.service";
import { GroceryItemComponent } from "../grocery-item/grocery-item.component";
import { GroceryItem } from "src/models/api.interface";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-grocery-list",
  imports: [GroceryItemComponent, IconComponent],
  templateUrl: "./grocery-list.component.html",
  styleUrl: "./grocery-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroceryListComponent {
  public filterPar = signal("");
  public groceryList = computed<GroceryItem[]>(() => {
    let grList = this.groceriesService.groceryList();
    if (grList === null) {
      return [];
    }
    grList = grList
      .filter((item) =>
        item.name.toLowerCase().includes(this.filterPar().toLowerCase()),
      )
      .sort((a, b) => {
        if (a.to_buy === b.to_buy) {
          return a.name.localeCompare(b.name);
        } else {
          if (a.to_buy) {
            return -1;
          } else {
            return 1;
          }
        }
      });
    return grList;
  });

  constructor(private groceriesService: GroceriesService) {}

  ngOnInit() {
    this.groceriesService.refreshGroceries();
  }

  onFilterInput(e: Event) {
    const newVal = (e.target as HTMLInputElement).value;
    this.filterPar.set(newVal);
  }

  addNewItem() {
    const newName = this.filterPar();
    if (newName === "") {
      console.error("Impossible code! Grocery Item name cannot be empty");
      return;
    }
    if ((this.groceryList() ?? []).map((item) => item.name).includes(newName)) {
      console.log(`Grocery Item "${newName}" already exists`);
      return;
    }
    this.groceriesService.createGroceryItem(newName, true);
    this.filterPar.set("");
  }
}
