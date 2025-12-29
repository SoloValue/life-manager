import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { AddExpenseFormComponent } from "src/app/components/add-expense-form/add-expense-form.component";
import { IconComponent } from "src/app/components/icon/icon.component";
import { TaskButtonComponent } from "src/app/components/task-button/task-button.component";
import { NavbarService } from "src/app/services/navbar.service";

@Component({
  selector: "app-expenses",
  imports: [TaskButtonComponent, IconComponent],
  templateUrl: "./expenses.page.html",
  styleUrl: "./expenses.page.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesPage {
  private expenseFormRef?: MatDialogRef<AddExpenseFormComponent>;

  constructor(
    private navbarService: NavbarService,
    private dialogRef: MatDialog,
  ) {}

  ngOnInit(): void {
    this.navbarService.setTitle("Expenses");
    this.onAddExpense();
  }

  onAddExpense() {
    if (this.expenseFormRef !== undefined) {
      console.log("Expense form already open!");
      return;
    }
    console.log("Adding expense");
    this.expenseFormRef = this.dialogRef.open(AddExpenseFormComponent);
    this.expenseFormRef
      .afterClosed()
      .subscribe(() => (this.expenseFormRef = undefined));
  }
}
