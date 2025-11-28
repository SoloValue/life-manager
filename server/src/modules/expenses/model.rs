use crate::Result;
use crate::db::connection::DbConnector;
use crate::modules::expenses::db::{ExpenseCategory, ExpenseDb};

use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Expense {
    pub id: i32,
    pub category: ExpenseCategory,
    pub value: f32,
    pub description: String,
    pub created_at: DateTime<Local>,
}
impl Expense {
    pub fn from_db_model(item: &ExpenseDb) -> Self {
        // let category = ExpenseCategory::from_str(&item.category)?;
        Self {
            id: item.id,
            category: item.category.clone(),
            value: item.value,
            description: item.description.clone(),
            created_at: item.created_at,
        }
    }

    pub async fn fetch_from_db(connector: &DbConnector) -> Result<Vec<Expense>> {
        // TODO try fetch instead of query_as
        // es. while let Some(row) = result.try_next().await? { ... }
        let result: Vec<ExpenseDb> = connector.fetch_model_from_table("expenses").await?;

        let result: Vec<Expense> = result
            .iter()
            .map(|val| Expense::from_db_model(val))
            .collect();

        Ok(result)
    }
}
