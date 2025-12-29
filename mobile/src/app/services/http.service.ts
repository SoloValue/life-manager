import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";
import { NewExpense } from "../models/expenses";

export interface ErrorResponse {
  status_code: number;
  message: string;
}

@Injectable({
  providedIn: "root",
})
export class HttpService {
  private HTTP_ADDRESS = "http://127.0.0.1:8000";

  constructor(private httpClient: HttpClient) {}

  ////////////////////////
  /////   EXPENSES   /////
  ////////////////////////

  public getExpenses() {
    return this.httpClient.get(`${this.HTTP_ADDRESS}/expenses`, {
      observe: "response",
      responseType: "json",
    });
    // .pipe(catchError(this.handleError));
  }

  public newExpense(new_expense: NewExpense) {
    return this.httpClient.post(`${this.HTTP_ADDRESS}/expenses`, new_expense, {
      observe: "response",
      responseType: "json",
    });
  }

  public deleteExpense(id: number) {
    return this.httpClient.delete(`${this.HTTP_ADDRESS}/expenses/${id}`, {
      observe: "response",
      responseType: "json",
    });
  }

  public getExpensesCategories() {
    return this.httpClient.get(`${this.HTTP_ADDRESS}/expenses/categories`, {
      observe: "response",
      responseType: "json",
    });
    // .pipe(catchError(this.handleError));
  }

  ///////////////////////
  /////  GROCERIES  /////
  ///////////////////////

  public getGroceries() {
    return this.httpClient.get(`${this.HTTP_ADDRESS}/groceries`, {
      observe: "response",
      responseType: "json",
    });
  }

  public editGroceryItem(name: string, new_val: boolean) {
    return this.httpClient.patch(
      `${this.HTTP_ADDRESS}/groceries`,
      {
        name: name,
        new_value: new_val,
      },
      {
        observe: "response",
        responseType: "json",
      },
    );
  }

  ////////////////////////
  ///// DATE REQUEST /////
  ////////////////////////

  public getDateRequests() {
    return this.httpClient.get(`${this.HTTP_ADDRESS}/date_requests`, {
      observe: "response",
      responseType: "json",
    });
  }

  public deleteDateRequest(id: number) {
    return this.httpClient.delete(`${this.HTTP_ADDRESS}/date_requests/${id}`, {
      observe: "response",
      responseType: "json",
    });
  }
}
