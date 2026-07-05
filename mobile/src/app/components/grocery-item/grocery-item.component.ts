import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { GroceriesService } from "src/app/services/groceries.service";
import { GroceryItem } from "src/models/api.interface";
import { ComplexIconComponent } from "../complex-icon/complex-icon.component";
import { ToastService } from "src/app/services/toast.service";

@Component({
  selector: "app-grocery-item",
  imports: [CommonModule, ComplexIconComponent],
  templateUrl: "./grocery-item.component.html",
  styleUrl: "./grocery-item.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroceryItemComponent {
  groceryItem = input.required<GroceryItem>();

  confirmDelete = false;

  constructor(
    private groceriesService: GroceriesService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.confirmDelete = false;
  }

  onBuyClick() {
    const oldVal = this.groceryItem();
    const newValue: boolean = !oldVal.to_buy;
    this.toastService.success("Switched!", "New value: " + newValue);
    this.groceriesService.editGroceryItem(oldVal.name, newValue);
  }

  getIconType(): "racoon_bin_open" | "racoon_bin_close" {
    return this.confirmDelete ? "racoon_bin_open" : "racoon_bin_close";
  }

  onDeleteClick() {
    console.log("WHAT");
    if (this.confirmDelete) {
      this.confirmDelete = false;
      this.groceriesService.deleteGroceryItem(this.groceryItem().name);
    } else {
      this.confirmDelete = true;
    }
  }
}
