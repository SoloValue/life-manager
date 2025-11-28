import { Injectable, signal } from "@angular/core";

interface ConfirmRequest {
  message: string;
  resolver: (val: boolean) => void;
}

@Injectable({
  providedIn: "root",
})
export class ConfirmPopupService {
  public request = signal<ConfirmRequest | null>(null);

  constructor() {}

  public confirm(message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.request.set({ message: message, resolver: resolve });
    });
  }

  public resolve(result: boolean) {
    const req = this.request();
    if (req !== null) {
      req.resolver(result);
      this.request.set(null);
    }
  }
}
