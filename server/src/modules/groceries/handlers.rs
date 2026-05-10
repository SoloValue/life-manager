use actix_web::{
    HttpResponse, Responder,
    web::{Data, Json, Path},
};

use crate::modules::groceries::{
    error::GroceriesError,
    model::{EditGroceryItemRequest, GroceryItem, NewGroceryItemRequest},
};
use crate::modules::{ApiError, ApiResult, logging};
use crate::{core::db::connection::DbConnector, modules::groceries::db::GroceryItemDb};

pub async fn get_groceries(db_data: Data<DbConnector>) -> ApiResult<Json<Vec<GroceryItem>>> {
    logging("GET /groceries");
    let groceries_vec = GroceryItem::fetch_from_db(&db_data).await;
    match groceries_vec {
        Ok(groceries_vec) => Ok(Json(groceries_vec)),
        Err(err) => {
            logging(&err.to_string());
            Err(ApiError::from(GroceriesError::SqlError(err.to_string())))
        }
    }
}

pub async fn edit_grocery(
    to_edit: Json<EditGroceryItemRequest>,
    db_conn: Data<DbConnector>,
) -> ApiResult<impl Responder> {
    logging("PATCH groceries");
    let to_edit = to_edit.into_inner();
    let db_conn = db_conn.into_inner();

    let query_result = db_conn.edit_row(to_edit).await;
    match query_result {
        Ok(_) => Ok(HttpResponse::Ok()),
        Err(err) => {
            logging(&err.to_string());
            Err(ApiError::from(GroceriesError::SqlError(err.to_string())))
        }
    }
}

pub async fn create_grocery(
    new_grocery_item: Json<NewGroceryItemRequest>,
    db_conn: Data<DbConnector>,
) -> ApiResult<impl Responder> {
    logging("POST /groceries");
    let new_grocery_item = new_grocery_item.into_inner();
    let db_conn = db_conn.into_inner();

    let new_grocery_item_db = new_grocery_item.to_new_db_model()?;
    let query_result = db_conn.insert_into_table(&new_grocery_item_db).await;
    match query_result {
        Ok(_) => Ok(HttpResponse::Created()),
        Err(err) => {
            logging(&err.to_string());
            Err(ApiError::from(GroceriesError::SqlError(err.to_string())))
        }
    }
}

pub async fn delete_grocery(
    grocery_item_name: Path<String>,
    db_conn: Data<DbConnector>,
) -> ApiResult<impl Responder> {
    let grocery_item_name = grocery_item_name.into_inner();
    let db_conn = db_conn.into_inner();

    let res = GroceryItemDb::delete_from_db(&grocery_item_name, &db_conn.pool).await;
    match res {
        Ok(_) => Ok(HttpResponse::Ok()),
        Err(err) => {
            logging(&err.to_string());
            Err(ApiError::from(GroceriesError::SqlError(err.to_string())))
        }
    }
}
