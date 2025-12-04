import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class NavbarService {
  public tile = signal("HOME");

  public setTitle(newTitle: string) {
    this.tile.set(newTitle);
  }
}
