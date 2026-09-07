use actix_web::{
    HttpResponse, Responder,
    web::{Data, Json, Path},
};

use crate::modules::date_requests::{
    db::NewDateRequestDb, error::DateRequestError, model::DateRequest,
};
use crate::modules::{ApiError, ApiResult};
use crate::{
    core::db::connection::DbConnector, modules::date_requests::model::NewDateRequestRequest,
};
use tracing::{error, instrument};

#[instrument(level = "debug", err(level = "debug"), skip(db_data))]
pub async fn get_date_requests(db_data: Data<DbConnector>) -> ApiResult<Json<Vec<DateRequest>>> {
    let date_request_vector = DateRequest::fetch_from_db(&db_data).await;

    match date_request_vector {
        Ok(some) => Ok(Json(some)),
        Err(err) => {
            error!(error = %err, "failed to fetch date requests");
            Err(ApiError::from(DateRequestError::SqlError(err.to_string())))
        }
    }
}

#[instrument(level = "debug", err(level = "debug"), skip(new_expense, db_conn))]
pub async fn create_date_request(
    new_expense: Json<NewDateRequestRequest>,
    db_conn: Data<DbConnector>,
) -> ApiResult<impl Responder> {
    let new_date_request: ApiResult<NewDateRequestDb> = new_expense.into_inner().to_new_db_model();
    match new_date_request {
        Ok(item) => {
            let db_result = db_conn.insert_into_table(&item).await;
            if let Err(err) = db_result {
                error!(error = %err, "failed to create date request");
                return Err(ApiError::from(DateRequestError::SqlError(err.to_string())));
            } else {
                return Ok(HttpResponse::Created().json(&item));
            }
        }
        Err(err) => {
            error!(error = %err, "invalid date request");
            return Err(ApiError::from(DateRequestError::DateRequestUpdateFailed));
        }
    }
}

#[instrument(level = "debug", err(level = "debug"), skip(db_data))]
pub async fn delete_date_request(
    db_data: Data<DbConnector>,
    id_identifier: Path<u32>,
) -> ApiResult<impl Responder> {
    let id = id_identifier.into_inner();

    match db_data.delete_from_table(&id, "date_requests").await {
        Ok(()) => Ok(HttpResponse::Ok()),
        Err(err) => {
            error!(error = %err, "failed to delete date request");
            return Err(ApiError::from(DateRequestError::DateRequestUpdateFailed));
        }
    }
}
