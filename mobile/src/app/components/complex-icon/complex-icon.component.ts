import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "app-complex-icon",
  imports: [],
  templateUrl: "./complex-icon.component.html",
  styleUrl: "./complex-icon.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplexIconComponent {
  icon = input.required<iconType>();
  size = input<string>("9");

  public getIconPath(): string {
    return paths[this.icon()];
  }
}

const paths = {
  racoon_bin_close: "assets/icon/racoon_bin_close.svg",
  racoon_bin_open: "assets/icon/racoon_bin_open.svg",
};
type iconType = keyof typeof paths;
