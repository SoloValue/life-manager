use actix_web::{
    HttpResponse, Responder, delete, get, post,
    web::{Data, Json, Path},
};
use chrono::{DateTime, Local};
use serde::Deserialize;

use crate::db::connection::DbConnector;
use crate::modules::date_requests::{db::NewDateRequestDb, model::DateRequest};
use crate::modules::{ApiResult, ExpenseApiError, logging};

#[derive(Deserialize)]
pub struct NewDateRequestRequest {
    pub description: String,
    pub planned_date: DateTime<Local>,
    pub duration_minutes: Option<i32>,
    pub created_by: String, // TODO use log information
}
impl NewDateRequestRequest {
    pub fn to_new_db_model(&self) -> ApiResult<NewDateRequestDb> {
        Ok(NewDateRequestDb {
            description: self.description.clone(),
            planned_date: self.planned_date,
            duration_minutes: self.duration_minutes,
            created_by: self.created_by.clone(),
            created_at: None,
        })
    }
}

#[get("")]
pub async fn get_date_requests(db_data: Data<DbConnector>) -> ApiResult<Json<Vec<DateRequest>>> {
    logging("GET /date_request");
    let date_request_vector = DateRequest::fetch_from_db(&db_data).await;

    match date_request_vector {
        Ok(some) => Ok(Json(some)),
        Err(err) => {
            logging(&err.to_string());
            Err(ExpenseApiError::ServerError)
        }
    }
}

#[post("")]
pub async fn create_date_request(
    new_expense: Json<NewDateRequestRequest>,
    db_conn: Data<DbConnector>,
) -> ApiResult<impl Responder> {
    logging("POST /expense");
    let new_date_request: ApiResult<NewDateRequestDb> = new_expense.into_inner().to_new_db_model();
    match new_date_request {
        Ok(item) => {
            let db_result = db_conn.insert_into_table(&item).await;
            if let Err(err) = db_result {
                logging(&err.to_string());
                return Err(ExpenseApiError::ServerError);
            } else {
                return Ok(HttpResponse::Created().json(&item));
            }
        }
        Err(err) => {
            logging(&err.to_string());
            return Err(ExpenseApiError::ExpenseUpdateFailed);
        }
    }
}

#[delete("/{id_date_request}")]
pub async fn delete_date_request(
    db_data: Data<DbConnector>,
    id_identifier: Path<u32>,
) -> ApiResult<impl Responder> {
    let id = id_identifier.into_inner();
    logging(&format!("DELETE /expense/{}", &id));

    match db_data.delete_from_table(&id, "date_requests").await {
        Ok(()) => Ok(HttpResponse::Ok()),
        Err(err) => {
            logging(&err.to_string());
            return Err(ExpenseApiError::ExpenseUpdateFailed);
        }
    }
}
