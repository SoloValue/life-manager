import { Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { AddExpenseFormComponent } from "../components/add-expense-form/add-expense-form.component";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
  imports: [IonicModule, AddExpenseFormComponent],
})
export class Tab2Page {
  constructor() {}
}
