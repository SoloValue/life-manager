import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "app-icon",
  imports: [],
  templateUrl: "./icon.component.html",
  styleUrl: "./icon.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  image = input<string>("expense");
  size = input<string>("9");
}
