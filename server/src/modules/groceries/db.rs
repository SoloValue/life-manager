use chrono::{DateTime, Local};
use serde::Serialize;
use sqlx::{self, FromRow, QueryBuilder};

use crate::db::connection::ToRow;

#[derive(Debug, FromRow)]
pub struct GroceryItemDb {
    pub name: String,
    pub to_buy: bool,
    pub created_at: DateTime<Local>,
}

#[derive(Serialize)]
pub struct NewGroceryItemDb {
    pub name: String,
    pub to_buy: bool,
    pub created_at: Option<DateTime<Local>>,
}
impl ToRow for NewGroceryItemDb {
    fn table_name() -> &'static str {
        "groceries"
    }

    fn columns() -> &'static [&'static str] {
        &["name", "to_buy", "created_at"]
    }

    fn bind_values<'a>(&'a self, qb: &mut QueryBuilder<'a, sqlx::Postgres>) {
        let new_dt = match self.created_at {
            Some(dt) => dt,
            None => Local::now(),
        };
        qb.push(format!("(\'{}\', ", &self.name))
            .push(format!("{}, ", &self.to_buy))
            .push(format!("\'{}\')", new_dt.to_rfc3339()));
    }
}
