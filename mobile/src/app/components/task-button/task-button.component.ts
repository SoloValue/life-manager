import { CommonModule } from "@angular/common";
import { Component, computed, input, output } from "@angular/core";
import { classColorSelection } from "src/utils/colors.utils";

@Component({
  selector: "app-task-button",
  templateUrl: "./task-button.component.html",
  styleUrls: ["./task-button.component.scss"],
  imports: [CommonModule],
})
export class TaskButtonComponent {
  color = input<ColorType>("red");
  size = input<string>("10");
  loading = input<boolean>(false);
  disabled = input<boolean>(false);

  /** Design tokens override */
  tokens = input({
    radius: "rounded-lg",
    transition: "transition-all",
  });

  /** Computed Tailwind class list */
  classes = computed(() => {
    const color = this.color();
    const size = this.size();
    const tokens = this.tokens();

    const base = [
      "inline-flex items-center justify-center",
      "focus:outline-none",
      tokens.radius,
      tokens.transition,
      this.disabled() || this.loading()
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer",
    ];

    const colorClass = classColorSelection[color];

    const sizeClass = `size-${size}`;

    return [...base, colorClass, sizeClass].join(" ");
  });

  /** OUTPUT **/
  onClick = output<void>();
}

type ColorType = keyof typeof classColorSelection;
