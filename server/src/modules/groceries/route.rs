use actix_web::{
    HttpResponse, Responder, delete, get, patch, post,
    web::{Data, Json, Path},
};
use serde::Deserialize;

use crate::modules::groceries::{db::NewGroceryItemDb, error::GroceriesError, model::GroceryItem};
use crate::modules::{ApiError, ApiResult, logging};
use crate::{
    db::connection::{DbConnector, EditRow},
    modules::groceries::db::GroceryItemDb,
};

#[derive(Deserialize)]
pub struct EditGroceryItemRequest {
    pub name: String,
    pub new_value: bool,
}
impl EditRow for EditGroceryItemRequest {
    // TODO move this into GroceryItem
    fn table_name() -> &'static str {
        "groceries"
    }

    fn bind_edit_values<'a>(&'a self, qb: &mut sqlx::QueryBuilder<'a, sqlx::Postgres>) {
        // TODO find a better way to do this
        qb.push(format!(
            "UPDATE {} SET to_buy = {} WHERE name = '{}'",
            EditGroceryItemRequest::table_name(),
            self.new_value,
            self.name,
        ));
    }
}

#[derive(Deserialize)]
pub struct NewGroceryItemRequest {
    pub name: String,
    pub to_buy: Option<bool>,
}
impl NewGroceryItemRequest {
    pub fn to_new_db_model(&self) -> ApiResult<NewGroceryItemDb> {
        if self.name.chars().count() > 30 {
            return Err(ApiError::from(GroceriesError::BadGroceryRequest(
                "Expecting max 30 characters for field 'name'".to_string(),
            )));
        }

        let to_buy = match &self.to_buy {
            Some(value) => *value,
            None => true,
        };

        Ok(NewGroceryItemDb {
            name: self.name.clone(),
            to_buy: to_buy,
            created_at: None,
        })
    }
}

#[get("")]
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

#[patch("")]
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

#[post("")]
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

#[delete("/{grocery_item_name}")]
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
