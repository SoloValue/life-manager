export type ToastColor = "green" | "yellow" | "red";

export interface Toast {
  id: number;
  title: string;
  message: string;
  color: ToastColor;
  timeoutId: ReturnType<typeof setTimeout>;
}
