import { Routes } from "@angular/router";
import { HomePage } from "./pages/home/home.page";

export const routes: Routes = [
  {
    path: "home",
    component: HomePage,
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
