import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { NewExpense } from "src/app/models/expenses";
import { AlertService } from "src/app/services/alert.service";
import { ExpensesService } from "src/app/services/expenses.service";

@Component({
  selector: "app-add-expense-form",
  templateUrl: "./add-expense-form.component.html",
  styleUrls: ["./add-expense-form.component.scss"],
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddExpenseFormComponent implements OnInit {
  private valueRegex = /^\d+((\.|\,)\d{1,2})?$/;

  public expenseCategoryList = computed(() =>
    this.expensesService.expenseCategoryList(),
  );
  public newExpenseForm = this.formBuilder.group({
    category: [null, Validators.required],
    description: [null, Validators.required],
    value: [null, [Validators.required, Validators.pattern(this.valueRegex)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private expensesService: ExpensesService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.expensesService.refreshCategoryList();
  }

  onSubmit() {
    let form_value = this.newExpenseForm.value;
    console.log(
      "Submitting AddExpenseForm with value: " + JSON.stringify(form_value),
    );
    if (this.newExpenseForm.invalid) {
      return;
    }

    const cleanValue = Number(
      String(form_value.value ?? NaN).replace(",", "."),
    );
    if (Number.isNaN(cleanValue)) {
      console.log("Invalid value in AddExpenseForm");
      return;
    }

    let newExpense: NewExpense = {
      category: form_value.category!,
      description: form_value.description!,
      value: cleanValue,
    };

    this.expensesService.createExpense(newExpense).subscribe((resp) => {
      this.alertService.show({
        header: resp.status + "",
        message: resp.statusText,
      });

      if (resp.ok) {
        this.newExpenseForm.reset();
      }
      this.expensesService.refreshExpenseList();
    });
  }
}
