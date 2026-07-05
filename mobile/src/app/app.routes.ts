import { Routes } from "@angular/router";
import { HomePage } from "./pages/home/home.page";
import { ExpensesPage } from "./pages/expenses/expenses.page";
import { GroceriesPage } from "./pages/groceries/groceries.page";
import { SettingsComponent } from "./pages/settings/settings.page";

export const routes: Routes = [
  {
    path: "home",
    component: HomePage,
  },
  {
    path: "expenses",
    component: ExpensesPage,
  },
  {
    path: "groceries",
    component: GroceriesPage,
  },
  {
    path: "settings",
    component: SettingsComponent,
  },
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
];
