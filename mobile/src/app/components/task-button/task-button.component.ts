import { CommonModule } from "@angular/common";
import { Component, computed, input } from "@angular/core";

@Component({
  selector: "app-task-button",
  templateUrl: "./task-button.component.html",
  styleUrls: ["./task-button.component.scss"],
  imports: [CommonModule],
})
export class TaskButtonComponent {
  label = input<string>("");
  variant = input<"primary" | "secondary" | "danger">("primary");
  size = input<"sm" | "md" | "lg">("md");
  loading = input<boolean>(false);
  disabled = input<boolean>(false);

  /** Design tokens override */
  tokens = input({
    radius: "rounded-lg",
    transition: "transition-all",
  });

  /** Computed Tailwind class list */
  classes = computed(() => {
    const v = this.variant();
    const s = this.size();
    const t = this.tokens();

    const base = [
      "inline-flex items-center justify-center font-medium",
      "focus:outline-none",
      t.radius,
      t.transition,
      this.disabled() || this.loading()
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer",
    ];

    const variantClass = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
      danger: "bg-red-600 text-white hover:bg-red-700",
    }[v];

    const sizeClass = {
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg",
    }[s];

    return [...base, variantClass, sizeClass].join(" ");
  });
}
