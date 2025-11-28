import { Injectable, signal } from "@angular/core";

import { HttpService } from "./http.service";
import { Expense } from "src/models/api.interface";
import { NewExpense } from "../models/expenses";
import { isArray } from "src/utils/array.utils";

export interface ErrorResponse {
  status_code: number;
  message: string;
}

@Injectable({
  providedIn: "root",
})
export class ExpensesService {
  public expenseList = signal<Expense[] | null>(null);
  public expenseCategoryList = signal<string[]>([]);

  constructor(private httpService: HttpService) {}

  public refreshExpenseList() {
    this.httpService.getExpenses().subscribe((resp) => {
      if (resp.ok) {
        // TODO make sure the body is correct
        this.expenseList.set(resp.body as any);
      } else {
        this.expenseList.set(null);
      }
    });
  }

  public refreshCategoryList() {
    this.httpService.getExpensesCategories().subscribe((resp) => {
      if (resp.ok) {
        if (isArray(resp.body, "string")) {
          // TODO check body
          this.expenseCategoryList.set(resp.body as string[]);
        } else {
          console.error("[expense-form]: Invalid expense category list!");
        }
      }
    });
  }

  public deleteExpense(id: number) {
    console.log("Deleting: " + id);
    this.httpService.deleteExpense(id).subscribe((resp) => {
      console.log(resp);
      this.refreshExpenseList();
    });
  }

  public createExpense(newExpense: NewExpense) {
    return this.httpService.newExpense(newExpense);
  }
}
