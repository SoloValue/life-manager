use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};

use crate::Result;
use crate::core::db::connection::DbConnector;
use crate::modules::expenses::db::{ExpenseCategory, ExpenseDb, NewExpenseDb};
use crate::modules::expenses::error::ExpensesError;
use crate::modules::{ApiError, ApiResult};

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
            Err(e) => Err(ApiError::from(ExpensesError::BadExpenseRequest(
                e.to_string(),
            ))),
        }
    }
}
