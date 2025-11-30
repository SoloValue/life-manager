import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Signal,
  signal,
} from "@angular/core";
import { AlertService } from "src/app/services/alert.service";

@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.scss"],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  public isVisible = computed(() => {
    const alertConfig = this.alertService.alertConfig();
    if (alertConfig === null) {
      return false;
    } else {
      this.header = alertConfig.header ?? "";
      this.subHeader = alertConfig.subHeader ?? "";
      this.message = alertConfig.message ?? "";
      return true;
    }
  });

  public header = "";
  public subHeader = "";
  public message = "";
  public buttons: Signal<string[]> = signal(["Ok"]);

  constructor(private alertService: AlertService) {}

  closePopup() {
    this.alertService.alertConfig.set(null);
  }
}
