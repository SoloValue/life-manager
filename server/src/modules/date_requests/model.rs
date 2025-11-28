use crate::Result;
use crate::db::connection::DbConnector;
use crate::modules::date_requests::db::DateRequestDb;

use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct DateRequest {
    pub id: i32,
    pub description: String,
    pub planned_date: DateTime<Local>,
    pub duration_minutes: Option<i32>, // None == full_day
    pub created_by: String,
    pub created_at: DateTime<Local>,
}
impl DateRequest {
    pub fn from_db_model(item: &DateRequestDb) -> Self {
        Self {
            id: item.id,
            description: item.description.clone(),
            planned_date: item.planned_date,
            duration_minutes: item.duration_minutes,
            created_by: item.created_by.clone(),
            created_at: item.created_at,
        }
    }

    pub async fn fetch_from_db(connector: &DbConnector) -> Result<Vec<DateRequest>> {
        let db_result: Vec<DateRequestDb> =
            connector.fetch_model_from_table("date_requests").await?;
        let result: Vec<DateRequest> = db_result
            .iter()
            .map(|val| DateRequest::from_db_model(val))
            .collect();
        Ok(result)
    }
}
