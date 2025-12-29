import { Routes } from "@angular/router";
import { HomePage } from "./pages/home/home.page";
import { ExpensesPage } from "./pages/expenses/expenses.page";
import { GroceriesPage } from "./pages/groceries/groceries.page";

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
  // {
  //   path: "/home",
  //   loadChildren: () =>
  //     import("./pages/home/home.page").then((m) => m.HomePage),
  // },
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
];
