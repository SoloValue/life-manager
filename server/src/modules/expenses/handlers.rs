use actix_web::{
    HttpResponse, Responder,
    web::{Data, Json, Path},
};

use crate::modules::expenses::{
    db::{ExpenseCategory, NewExpenseDb},
    error::ExpensesError,
    model::Expense,
};
use crate::modules::{ApiError, ApiResult};
use crate::{core::db::connection::DbConnector, modules::expenses::model::NewExpenseRequest};
use tracing::{error, instrument};

#[instrument(level = "debug", err(level = "debug"), skip(db_data))]
pub async fn get_expenses(db_data: Data<DbConnector>) -> ApiResult<Json<Vec<Expense>>> {
    let expense_vec = Expense::fetch_from_db(&db_data).await;
    match expense_vec {
        Ok(expense_vec) => Ok(Json(expense_vec)),
        Err(err) => {
            error!(error = %err, "failed to fetch expenses");
            Err(ApiError::from(ExpensesError::SqlError(err.to_string())))
        }
    }
}

#[instrument(level = "debug", err(level = "debug"), skip(new_expense, db_conn))]
pub async fn create_expense(
    new_expense: Json<NewExpenseRequest>,
    db_conn: Data<DbConnector>,
) -> ApiResult<impl Responder> {
    let new_expense_res: ApiResult<NewExpenseDb> = new_expense.into_inner().to_new_db_model();
    match new_expense_res {
        Ok(new_expense) => {
            let db_res = db_conn.insert_into_table(&new_expense).await;
            if let Err(err) = db_res {
                error!(error = %err, "failed to create expense");
                return Err(ApiError::from(ExpensesError::SqlError(err.to_string())));
            }
            return Ok(HttpResponse::Created().json(&new_expense));
        }
        Err(err) => {
            error!(error = %err, "invalid expense request");
            return Err(ApiError::from(ExpensesError::ExpenseUpdateFailed));
        }
    }
}

#[instrument(level = "debug", err(level = "debug"), skip(db_data))]
pub async fn delete_expense(
    db_data: Data<DbConnector>,
    id_identifier: Path<u32>,
) -> ApiResult<impl Responder> {
    let id = id_identifier.into_inner();

    match db_data.delete_from_table(&id, "expenses").await {
        Ok(()) => Ok(HttpResponse::Ok()),
        Err(err) => {
            error!(error = %err, "failed to delete expense");
            return Err(ApiError::from(ExpensesError::ExpenseUpdateFailed));
        }
    }
}

#[instrument(level = "debug", err(level = "debug"))]
pub async fn get_categories() -> ApiResult<Json<Vec<&'static str>>> {
    let exp_vector = ExpenseCategory::get_all();
    let a = exp_vector.iter().map(|exp| exp.as_str()).collect();
    Ok(Json(a))
}
