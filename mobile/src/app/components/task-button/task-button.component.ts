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

    const colorClass = {
      red: "bg-red-500",
      orange: "bg-orange-500",
      amber: "bg-amber-500",
      yellow: "bg-yellow-500",
      lime: "bg-lime-500",
      green: "bg-green-500",
      emerald: "bg-emerald-500",
      teal: "bg-teal-500",
      cyan: "bg-cyan-500",
      sky: "bg-sky-500",
      blue: "bg-blue-500",
      indigo: "bg-indigo-500",
      violet: "bg-violet-500",
      purple: "bg-purple-500",
      fuchsia: "bg-fuchsia-500",
      pink: "bg-pink-500",
      rose: "bg-rose-500",
      slate: "bg-slate-500",
      gray: "bg-gray-500",
      zinc: "bg-zinc-500",
      neutral: "bg-neutral-500",
      stone: "bg-stone-500",
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
