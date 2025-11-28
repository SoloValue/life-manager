import { Component, computed } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { DateRequestService } from "../services/date-request.service";
import { DateRequestItemComponent } from "../components/date-request-item/date-request-item.component";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
  imports: [IonicModule, DateRequestItemComponent],
})
export class Tab3Page {
  public dateRequestList = computed(() => this.drService.dateRequestList());

  constructor(private drService: DateRequestService) {}

  ngOnInit() {
    this.drService.refreshDateRequests();
  }

  public deleteDateRequest(id: number) {
    this.drService.deleteDateRequest(id).subscribe((resp) => {});
  }
}
