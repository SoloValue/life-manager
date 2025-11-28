import { Component, input, output } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { DateRequest } from "src/models/api.interface";

@Component({
  selector: "app-date-request-item",
  templateUrl: "./date-request-item.component.html",
  styleUrls: ["./date-request-item.component.scss"],
  imports: [IonicModule],
})
export class DateRequestItemComponent {
  public date_request = input<DateRequest>();

  public deleteDateRequestEvent = output<number>();

  constructor() {}

  public onDeleteClick() {
    this.deleteDateRequestEvent.emit(this.date_request()!.id);
  }
}
