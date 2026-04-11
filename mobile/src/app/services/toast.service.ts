import { Injectable, signal } from "@angular/core";
import { Toast, ToastColor } from "../components/toast/toast.model";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  // Private writable signal — only this service mutates the list
  private readonly _toasts = signal<Toast[]>([]);

  private readonly DEFAULT_DURATION_MS = 8_000;
  private nextId = 0;

  // Public readonly view — components consume this
  readonly toasts = this._toasts.asReadonly();

  public show(
    title: string,
    message: string,
    color: ToastColor,
    durationMs = this.DEFAULT_DURATION_MS,
  ): void {
    const id = this.nextId++;

    const timeoutId = setTimeout(() => this.dismiss(id), durationMs);

    const toast: Toast = { id, title, message, color, timeoutId };

    // Prepend so newest toast is at index 0 → renders on top
    this._toasts.update((current) => [toast, ...current]);
  }

  public dismiss(id: number): void {
    this._toasts.update((current) => {
      const toast = current.find((t) => t.id === id);
      if (toast) {
        // Cancel the auto-dismiss timer if the user closed it manually
        clearTimeout(toast.timeoutId);
      }
      return current.filter((t) => t.id !== id);
    });
  }

  public success(title: string, message: string, durationMs?: number): void {
    this.show(title, message, "green", durationMs);
  }

  public warning(title: string, message: string, durationMs?: number): void {
    this.show(title, message, "yellow", durationMs);
  }

  public error(title: string, message: string, durationMs?: number): void {
    this.show(title, message, "red", durationMs);
  }
}
