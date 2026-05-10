use chrono::{DateTime, Local};
use serde::Serialize;
use sqlx::{self, FromRow, PgPool, QueryBuilder};

use crate::Result;
use crate::core::db::connection::ToRow;

#[derive(Debug, FromRow)]
pub struct GroceryItemDb {
    pub name: String,
    pub to_buy: bool,
    pub created_at: DateTime<Local>,
}
impl GroceryItemDb {
    pub async fn delete_from_db(name: &str, pool: &PgPool) -> Result<()> {
        let delete_query = format!(
            "DELETE FROM {} WHERE name = '{}'",
            NewGroceryItemDb::table_name(),
            name
        );
        let _ = sqlx::query(&delete_query).fetch_optional(pool).await?;
        Ok(())
    }
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
