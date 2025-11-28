import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { Expense } from "src/models/api.interface";

@Component({
  selector: "app-expense-item",
  templateUrl: "./expense-item.component.html",
  styleUrls: ["./expense-item.component.scss"],
  imports: [IonicModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseItemComponent {
  public expense = input<Expense>();

  public deleteExpenseEvent = output<number>();

  constructor() {}

  public onDeleteClick() {
    this.deleteExpenseEvent.emit(this.expense()!.id);
  }
}
