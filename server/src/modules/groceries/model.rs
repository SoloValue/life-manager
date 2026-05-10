use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};

use crate::core::db::connection::{DbConnector, EditRow, ToRow};
use crate::modules::groceries::db::NewGroceryItemDb;
use crate::modules::groceries::error::GroceriesError;
use crate::modules::{ApiError, ApiResult};
use crate::{Result, modules::groceries::db::GroceryItemDb};

#[derive(Debug, Serialize, Deserialize)]
pub struct GroceryItem {
    pub name: String,
    pub to_buy: bool,
    pub created_at: DateTime<Local>,
}
impl GroceryItem {
    pub fn from_db_model(item: &GroceryItemDb) -> Self {
        Self {
            name: item.name.clone(),
            to_buy: item.to_buy,
            created_at: item.created_at,
        }
    }

    pub async fn fetch_from_db(connector: &DbConnector) -> Result<Vec<GroceryItem>> {
        // TODO try fetch instead of query_as
        // es. while let Some(row) = result.try_next().await? { ... }
        let result: Vec<GroceryItemDb> = connector
            .fetch_model_from_table(NewGroceryItemDb::table_name())
            .await?;

        let result: Vec<GroceryItem> = result
            .iter()
            .map(|val| GroceryItem::from_db_model(val))
            .collect();

        Ok(result)
    }
}

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
