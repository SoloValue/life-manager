import { Injectable, signal } from "@angular/core";
import {
  classColorSelection,
  classSecondaryColorSelection,
} from "src/utils/colors.utils";

@Injectable({
  providedIn: "root",
})
export class NavbarService {
  public tile = signal("HOME");
  public primary = signal("bg-(--home-color)");
  public secondary = signal("bg-(--home-secondary-color)");

  public setTitle(newTitle: string) {
    this.tile.set(newTitle);
  }

  public setPrimary(newColor: keyof typeof classColorSelection) {
    const colorClass = classColorSelection[newColor];
    this.primary.set(colorClass);
  }

  public setSecondary(newColor: keyof typeof classSecondaryColorSelection) {
    const colorClass = classSecondaryColorSelection[newColor];
    this.secondary.set(colorClass);
  }
}
