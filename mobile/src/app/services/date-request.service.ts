import { Injectable, signal } from "@angular/core";

import { HttpService } from "./http.service";
import { DateRequest } from "src/models/api.interface";

@Injectable({
  providedIn: "root",
})
export class DateRequestService {
  public dateRequestList = signal<DateRequest[] | null>(null);

  constructor(private httpService: HttpService) {}

  public refreshDateRequests() {
    this.httpService.getDateRequests().subscribe((resp) => {
      if (resp.ok) {
        this.dateRequestList.set(resp.body as any);
      } else {
        this.dateRequestList.set(null);
      }
    });
  }

  public deleteDateRequest(id: number) {
    return this.httpService.deleteDateRequest(id);
  }
}
