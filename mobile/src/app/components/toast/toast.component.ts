import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
import { NgClass } from "@angular/common";

import { Toast } from "./toast.model";
import { ToastService } from "src/app/services/toast.service";

@Component({
  selector: "app-toast",
  imports: [NgClass],
  templateUrl: "./toast.component.html",
  styleUrl: "./toast.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  toasts = computed(() => this.toastService.toasts());

  constructor(private toastService: ToastService) {}

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  // Used by @for track — must be a stable identity per toast
  trackById(_index: number, toast: Toast): number {
    return toast.id;
  }

  colorClasses(toast: Toast): Record<string, boolean> {
    return {
      "border-green-500 bg-green-50 text-green-900": toast.color === "green",
      "border-yellow-500 bg-yellow-50 text-yellow-900":
        toast.color === "yellow",
      "border-red-500 bg-red-50 text-red-900": toast.color === "red",
    };
  }

  iconClasses(toast: Toast): Record<string, boolean> {
    return {
      "text-green-500": toast.color === "green",
      "text-yellow-500": toast.color === "yellow",
      "text-red-500": toast.color === "red",
    };
  }

  iconPath(toast: Toast): string {
    switch (toast.color) {
      case "green":
        return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
      case "yellow":
        return "M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z";
      case "red":
        return "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";
    }
  }
}
