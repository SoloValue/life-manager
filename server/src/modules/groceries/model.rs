use crate::db::connection::{DbConnector, ToRow};
use crate::modules::groceries::db::NewGroceryItemDb;
use crate::{Result, modules::groceries::db::GroceryItemDb};

use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};

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
