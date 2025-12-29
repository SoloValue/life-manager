import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

@Component({
  selector: "app-icon",
  imports: [],
  templateUrl: "./icon.component.html",
  styleUrl: "./icon.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  image = input<ImageType>("expense");
  size = input<string>("9");

  svgContent = computed(() => {
    const image = this.image();

    const svgValue = {
      expense:
        "M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
      insert: "M12 4.5v15m7.5-7.5h-15",
    }[image];

    return svgValue;
  });
}

type ImageType = "expense" | "insert";
