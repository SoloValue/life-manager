import { Injectable, signal } from "@angular/core";
import { Subject } from "rxjs";
import { SetAlertConfig } from "../models/alert";

@Injectable({
  providedIn: "root",
})
export class AlertService {
  public alertConfig = signal<SetAlertConfig | null>(null);

  constructor() {}

  public show(alertConfig: SetAlertConfig) {
    this.alertConfig.set(alertConfig);
  }
}
