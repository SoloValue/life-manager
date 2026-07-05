import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Router } from "@angular/router";

import { IconComponent } from "src/app/components/icon/icon.component";
import { TaskButtonComponent } from "src/app/components/task-button/task-button.component";
import { NavbarService } from "src/app/services/navbar.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
  imports: [TaskButtonComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  constructor(
    private router: Router,
    private navbarService: NavbarService,
  ) {}

  ngOnInit() {
    this.navbarService.setTitle("HOME");
    this.navbarService.setPrimary("home");
    this.navbarService.setSecondary("home");
  }

  goToTaks(task: TaskType) {
    this.router.navigate([`/${task}`]);
  }
}

type TaskType = "expenses" | "groceries" | "settings";
