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

  ngOnInit() {
    console.log(this.groceryItem().name + ": " + this.groceryItem().to_buy);
  }

  onBuyClick() {
    const oldVal = this.groceryItem();
    const newValue: boolean = !oldVal.to_buy;
    this.groceriesService.editGroceryItem(oldVal.name, newValue);
  }
}
