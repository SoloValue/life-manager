import { CommonModule } from "@angular/common";
import { Component, computed, input, output } from "@angular/core";

@Component({
  selector: "app-task-button",
  templateUrl: "./task-button.component.html",
  styleUrls: ["./task-button.component.scss"],
  imports: [CommonModule],
})
export class TaskButtonComponent {
  color = input<ColorType>("red");
  colorIntensity = input<ColorIntensityType>("500");
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
    const colorIntensity = this.colorIntensity();
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

    const colorClass = {
      red: "bg-red-" + colorIntensity,
      orange: "bg-orange-" + colorIntensity,
      amber: "bg-amber-" + colorIntensity,
      yellow: "bg-yellow-" + colorIntensity,
      lime: "bg-lime-" + colorIntensity,
      green: "bg-green-" + colorIntensity,
      emerald: "bg-emerald-" + colorIntensity,
      teal: "bg-teal-" + colorIntensity,
      cyan: "bg-cyan-" + colorIntensity,
      sky: "bg-sky-" + colorIntensity,
      blue: "bg-blue-" + colorIntensity,
      indigo: "bg-indigo-" + colorIntensity,
      violet: "bg-violet-" + colorIntensity,
      purple: "bg-purple-" + colorIntensity,
      fuchsia: "bg-fuchsia-" + colorIntensity,
      pink: "bg-pink-" + colorIntensity,
      rose: "bg-rose-" + colorIntensity,
      slate: "bg-slate-" + colorIntensity,
      gray: "bg-gray-" + colorIntensity,
      zinc: "bg-zinc-" + colorIntensity,
      neutral: "bg-neutral-" + colorIntensity,
      stone: "bg-stone-" + colorIntensity,
    }[color];

    const sizeClass = `size-${size}`;

    return [...base, colorClass, sizeClass].join(" ");
  });

  /** OUTPUT **/
  onClick = output<void>();
}

type ColorType =
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose"
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone";
type ColorIntensityType =
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "950";
