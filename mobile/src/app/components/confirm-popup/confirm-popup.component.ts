import { Component, ChangeDetectionStrategy, computed } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ConfirmPopupService } from "src/app/services/confirm-popup.service";

@Component({
  selector: "app-confirm-popup",
  templateUrl: "./confirm-popup.component.html",
  imports: [IonicModule],
  styleUrls: ["./confirm-popup.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmPopupComponent {
  private request = computed(() => {
    this.message = this.confirmService.request()?.message ?? "";
    return this.confirmService.request();
  });

  public isVisible = computed(() => this.request() !== null);
  public message = "";

  constructor(private confirmService: ConfirmPopupService) {}

  public onConfirm() {
    this.request()?.resolver(true);
    this.confirmService.request.set(null);
  }

  public onCancel() {
    this.request()?.resolver(false);
    this.confirmService.request.set(null);
  }
}
