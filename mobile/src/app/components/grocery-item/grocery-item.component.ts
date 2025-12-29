import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { GroceriesService } from "src/app/services/groceries.service";
import { GroceryItem } from "src/models/api.interface";

@Component({
  selector: "app-grocery-item",
  imports: [CommonModule],
  templateUrl: "./grocery-item.component.html",
  styleUrl: "./grocery-item.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroceryItemComponent {
  groceryItem = input.required<GroceryItem>();

  constructor(private groceriesService: GroceriesService) {}

  onBuySwitch(event: Event) {
    const newValue = (event.target as HTMLInputElement).checked;
    const oldVal = this.groceryItem()!;
    this.groceriesService.editGroceryItem(oldVal.name, newValue);
  }
}
