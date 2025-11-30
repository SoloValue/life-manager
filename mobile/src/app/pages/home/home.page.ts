import { Component } from "@angular/core";
import { TaskButtonComponent } from "src/app/components/task-button/task-button.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
  imports: [TaskButtonComponent],
})
export class HomePage {
  constructor() {}

  goToTaks(task: string) {
    console.log("Moving to " + task);
  }
}
