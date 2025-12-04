import { Component } from "@angular/core";
import { IconComponent } from "src/app/components/icon/icon.component";
import { TaskButtonComponent } from "src/app/components/task-button/task-button.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
  imports: [TaskButtonComponent, IconComponent],
})
export class HomePage {
  goToTaks(task: string) {
    console.log("Moving to " + task);
  }
}
