import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";

import { ConfirmPopupService } from "../../services/confirm-popup.service";
import { ExpenseItemComponent } from "../expense-item/expense-item.component";
import { ExpensesService } from "src/app/services/expenses.service";

@Component({
  selector: "app-expense-list",
  templateUrl: "./expense-list.component.html",
  styleUrls: ["./expense-list.component.scss"],
  imports: [CommonModule, IonicModule, ExpenseItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseListComponent implements OnInit {
  public expenseList = computed(() => this.expensesService.expenseList());

  constructor(
    private expensesService: ExpensesService,
    private confirmService: ConfirmPopupService,
  ) {}

  public ngOnInit() {
    this.refreshExpenseList();
  }

  public refreshExpenseList() {
    this.expensesService.refreshExpenseList();
  }

  public deleteExpense(id: number) {
    console.log("Deleting: " + id);
    this.confirmService.confirm("Deleting item " + id + "?").then((conf) => {
      if (!conf) {
        return;
      }
      this.expensesService.deleteExpense(id);
    });
  }
}
