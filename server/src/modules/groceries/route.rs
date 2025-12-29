use actix_web::{
    HttpResponse, Responder, get, patch,
    web::{Data, Json},
};
use serde::Deserialize;

use crate::db::connection::{DbConnector, EditRow};
use crate::modules::groceries::{db::NewGroceryItemDb, model::GroceryItem};
use crate::modules::{ApiResult, ExpenseApiError, logging};

// TODO create GroceriesApiError

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
}
impl NewGroceryItemRequest {
    pub fn to_new_db_model(&self) -> ApiResult<NewGroceryItemDb> {
        if self.name.chars().count() > 20 {
            return Err(ExpenseApiError::BadExpenseRequest);
        }

        Ok(NewGroceryItemDb {
            name: self.name.clone(),
            to_buy: true,
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
            Err(ExpenseApiError::ServerError)
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
            Err(ExpenseApiError::ServerError)
        }
    }
}
