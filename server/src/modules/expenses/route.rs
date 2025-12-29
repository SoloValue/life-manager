use actix_web::{
    HttpResponse, Responder, delete, get, post,
    web::{Data, Json, Path},
};
use serde::{Deserialize, Serialize};

use crate::db::connection::DbConnector;
use crate::modules::expenses::{
    db::{ExpenseCategory, NewExpenseDb},
    model::Expense,
};
use crate::modules::{ApiResult, ExpenseApiError, logging};

#[derive(Deserialize)]
pub struct NewExpenseRequest {
    pub category: String,
    pub value: f32,
    pub description: String,
}
impl NewExpenseRequest {
    pub fn to_new_db_model(&self) -> ApiResult<NewExpenseDb> {
        let p_result = ExpenseCategory::try_from(self.category.as_str());
        match p_result {
            Ok(cat) => Ok(NewExpenseDb {
                category: cat,
                value: self.value,
                description: self.description.clone(),
                created_at: None,
            }),
            Err(_) => Err(ExpenseApiError::BadExpenseRequest),
        }
    }
}

#[derive(Serialize)]
pub struct ResponseBody {
    id: String,
}

#[get("")]
pub async fn get_expenses(db_data: Data<DbConnector>) -> ApiResult<Json<Vec<Expense>>> {
    logging("GET /expenses");
    let expense_vec = Expense::fetch_from_db(&db_data).await;
    match expense_vec {
        Ok(expense_vec) => Ok(Json(expense_vec)),
        Err(err) => {
            logging(&err.to_string());
            Err(ExpenseApiError::ServerError)
        }
    }
}

#[post("")]
pub async fn create_expense(
    new_expense: Json<NewExpenseRequest>,
    db_conn: Data<DbConnector>,
) -> ApiResult<impl Responder> {
    logging("POST /expenses");
    let new_expense_res: ApiResult<NewExpenseDb> = new_expense.into_inner().to_new_db_model();
    match new_expense_res {
        Ok(new_expense) => {
            let db_res = db_conn.insert_into_table(&new_expense).await;
            if let Err(err) = db_res {
                logging(&err.to_string());
                return Err(ExpenseApiError::ServerError);
            }
            return Ok(HttpResponse::Created().json(&new_expense));
        }
        Err(err) => {
            logging(&err.to_string());
            return Err(ExpenseApiError::ExpenseUpdateFailed);
        }
    }
}

#[delete("/{id_expense}")]
pub async fn delete_expense(
    db_data: Data<DbConnector>,
    id_identifier: Path<u32>,
) -> ApiResult<impl Responder> {
    let id = id_identifier.into_inner();
    logging(&format!("DELETE /expenses/{}", &id));

    match db_data.delete_from_table(&id, "expenses").await {
        Ok(()) => Ok(HttpResponse::Ok()),
        Err(err) => {
            logging(&err.to_string());
            return Err(ExpenseApiError::ExpenseUpdateFailed);
        }
    }
}

#[get("/categories")]
pub async fn get_categories() -> ApiResult<Json<Vec<&'static str>>> {
    logging("GET /expenses/categories");
    let exp_vector = ExpenseCategory::get_all();
    let a = exp_vector.iter().map(|exp| exp.as_str()).collect();
    Ok(Json(a))
}
