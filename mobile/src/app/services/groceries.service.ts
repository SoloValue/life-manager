import { effect, Injectable, signal } from "@angular/core";
import { GroceryItem } from "src/models/api.interface";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: "root",
})
export class GroceriesService {
  public groceryList = signal<GroceryItem[] | null>(null);
  constructor(private httpService: HttpService) {}

  public refreshGroceries() {
    this.httpService.getGroceries().subscribe((resp) => {
      if (resp.ok) {
        // TODO make sure the body is correct
        this.groceryList.set(resp.body as any);
      } else {
        this.groceryList.set(null);
      }
    });
  }

  public editGroceryItem(name: string, newValue: boolean) {
    if (this.groceryList() === null) {
      return;
    }
    this.groceryList.update((list) =>
      list!.map((val) =>
        val.name === name ? { ...val, to_buy: newValue } : val,
      ),
    );
    this.httpService.editGroceryItem(name, newValue).subscribe((resp) => {
      if (!resp.ok) {
        // TODO show an alert
      }
    });
  }
}
