use actix_web::{
    HttpResponse, Responder,
    web::{Data, Json, Path},
};

use crate::modules::date_requests::{
    db::NewDateRequestDb, error::DateRequestError, model::DateRequest,
};
use crate::modules::{ApiError, ApiResult, logging};
use crate::{
    core::db::connection::DbConnector, modules::date_requests::model::NewDateRequestRequest,
};

pub async fn get_date_requests(db_data: Data<DbConnector>) -> ApiResult<Json<Vec<DateRequest>>> {
    logging("GET /date_request");
    let date_request_vector = DateRequest::fetch_from_db(&db_data).await;

    match date_request_vector {
        Ok(some) => Ok(Json(some)),
        Err(err) => {
            logging(&err.to_string());
            Err(ApiError::from(DateRequestError::SqlError(err.to_string())))
        }
    }
}

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
                return Err(ApiError::from(DateRequestError::SqlError(err.to_string())));
            } else {
                return Ok(HttpResponse::Created().json(&item));
            }
        }
        Err(err) => {
            logging(&err.to_string());
            return Err(ApiError::from(DateRequestError::DateRequestUpdateFailed));
        }
    }
}

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
            return Err(ApiError::from(DateRequestError::DateRequestUpdateFailed));
        }
    }
}
