use chrono::{DateTime, Local};
use serde::Serialize;
use sqlx::{QueryBuilder, prelude::FromRow};

use crate::db::connection::ToRow;

#[derive(Debug, FromRow)]
pub struct DateRequestDb {
    pub id: i32,
    pub description: String,
    pub planned_date: DateTime<Local>,
    pub duration_minutes: Option<i32>, // None == full_day
    pub created_by: String,
    pub created_at: DateTime<Local>,
}

#[derive(Serialize)]
pub struct NewDateRequestDb {
    pub description: String,
    pub planned_date: DateTime<Local>,
    pub duration_minutes: Option<i32>, // None == full_day
    pub created_by: String,
    pub created_at: Option<DateTime<Local>>,
}
impl ToRow for NewDateRequestDb {
    fn table_name() -> &'static str {
        "date_requests"
    }

    fn columns() -> &'static [&'static str] {
        &[
            "description",
            "planned_date",
            "duration_minutes",
            "created_by",
            "created_at",
        ]
    }

    fn bind_values<'a>(&'a self, qb: &mut QueryBuilder<'a, sqlx::Postgres>) {
        let new_dt = match self.created_at {
            Some(date) => date,
            None => Local::now(),
        };
        let planned_duration = match self.duration_minutes {
            Some(dur) => dur.to_string(),
            None => "null".to_string(),
        };

        qb.push(format!("(\'{}\', ", &self.description))
            .push(format!("{}, ", &self.planned_date))
            .push(format!("\'{}\', ", planned_duration))
            .push(format!("\'{}\', ", "Matteo")) // TODO use logged value
            .push(format!("\'{}\')", new_dt));
    }
}
