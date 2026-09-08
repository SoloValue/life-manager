import { Injectable, signal } from "@angular/core";
import { GroceryItem } from "src/models/api.interface";
import { HttpService } from "./http.service";
import { StorageService } from "./storage.service";

const STORAGE_KEY = "groceries";

@Injectable({
  providedIn: "root",
})
export class GroceriesService {
  public groceryList = signal<GroceryItem[] | null>(null);
  constructor(
    private httpService: HttpService,
    private storage: StorageService,
  ) {}

  public async refreshGroceries() {
    await this.loadCachedGroceries();
    this.httpService.getGroceries().subscribe((resp) => {
      if (resp.ok) {
        // TODO make sure the body is correct
        this.groceryList.set(resp.body as any);
        this.persistList();
      }
      // on failure keep the cached list (offline fallback)
    });
  }

  private async loadCachedGroceries() {
    const cached = await this.storage.get<GroceryItem[]>(STORAGE_KEY);
    if (cached !== null) {
      this.groceryList.set(cached);
    }
  }

  private persistList() {
    const list = this.groceryList();
    if (list !== null) {
      void this.storage.set(STORAGE_KEY, list);
    }
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

  public createGroceryItem(name: string, to_buy?: boolean) {
    this.httpService.createGroceryItem(name, to_buy).subscribe((resp) => {
      if (resp.ok) {
        this.groceryList.update((list) => [
          ...(list ?? []),
          {
            name: name,
            to_buy: to_buy ?? true,
            created_at: "", // TODO
          },
        ]);
      }
    });
  }

  public deleteGroceryItem(name: string) {
    this.httpService.deleteGroceryItem(name).subscribe((resp) => {
      if (resp.ok) {
        this.groceryList.update((list) =>
          list!.filter((val) => val.name != name),
        );
      }
    });
  }
}
