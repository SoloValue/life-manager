import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { NewExpense } from "src/app/models/expenses";
import { AlertService } from "src/app/services/alert.service";
import { ExpensesService } from "src/app/services/expenses.service";
import { HttpService } from "src/app/services/http.service";
import { isArray } from "src/utils/array.utils";

@Component({
  selector: "app-add-expense-form",
  templateUrl: "./add-expense-form.component.html",
  styleUrls: ["./add-expense-form.component.scss"],
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddExpenseFormComponent implements OnInit {
  public expenseCategoryList = computed(() =>
    this.expensesService.expenseCategoryList(),
  );
  public newExpenseForm = this.formBuilder.group({
    category: [null, Validators.required],
    description: [null, Validators.required],
    value: [null, [Validators.required, Validators.min(0.01)]],
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
    if (this.newExpenseForm.invalid) {
      return;
    }
    let form_value = this.newExpenseForm.value;
    let newExpense: NewExpense = {
      category: form_value.category!,
      description: form_value.description!,
      value: form_value.value!,
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
