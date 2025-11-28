import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { ExpenseListComponent } from "../components/expense-list/expense-list.component";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
  imports: [CommonModule, IonicModule, ExpenseListComponent],
})
export class Tab1Page {
  constructor() {}
}
